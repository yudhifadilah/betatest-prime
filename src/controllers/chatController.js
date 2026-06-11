const { Op } = require("sequelize");
const { ChatRoom, ChatMessage } = require("../models");

const normalizeService = (service = "") => {
  return String(service).toLowerCase().trim();
};

const getAllowedServicesByRole = (role) => {
  if (role === "admin") {
    return ["vilog", "payout", "gifting"];
  }

  if (role === "staff") {
    return ["limited", "limited-items", "limited items", "lims", "item limited"];
  }

  return [];
};

exports.createRoom = async (req, res) => {
  try {
    const service = normalizeService(req.body.service);

    const data = await ChatRoom.create({
      orderId: req.body.orderId || `PRE-${Date.now()}`,
      buyerName: req.body.buyerName || "Customer",
      service,
      isAccepted: false,
      acceptedBy: null,
    });

    res.status(201).json({
      message: "Room chat berhasil dibuat",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat room chat",
      error: error.message,
    });
  }
};

exports.updateRoomOrderId = async (req, res) => {
  try {
    const roomId = req.params.roomId || req.body.roomId;
    const { orderId, buyerName } = req.body;

    if (!roomId || !orderId) {
      return res.status(400).json({
        message: "roomId dan orderId wajib diisi",
      });
    }

    const room = await ChatRoom.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    await room.update({
      orderId,
      buyerName: buyerName || room.buyerName,
    });

    res.json({
      message: "Order ID chat berhasil diperbarui",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update order ID chat",
      error: error.message,
    });
  }
};

exports.acceptRoom = async (req, res) => {
  try {
    const role = req.user?.role;

    if (!["admin", "staff"].includes(role)) {
      return res.status(403).json({
        message: "Hanya admin atau staff yang dapat menerima chat",
      });
    }

    const room = await ChatRoom.findByPk(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    const service = normalizeService(room.service);
    const allowedServices = getAllowedServicesByRole(role);
    const isAllowed = allowedServices.some((item) => service.includes(item));

    if (!isAllowed) {
      return res.status(403).json({
        message:
          role === "admin"
            ? "Admin hanya dapat menerima chat Vilog, Payout, dan Gifting"
            : "Staff hanya dapat menerima chat Limited Items",
      });
    }

    await room.update({
      isAccepted: true,
      acceptedBy: req.user?.id || null,
    });

    res.json({
      message: "Room chat berhasil diterima",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menerima room chat",
      error: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const room = await ChatRoom.findByPk(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    const data = await ChatMessage.findAll({
      where: {
        roomId: req.params.roomId,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      data,
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pesan",
      error: error.message,
    });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const role = req.user?.role;
    const allowedServices = getAllowedServicesByRole(role);

    if (!allowedServices.length) {
      return res.status(403).json({
        message: "Role tidak memiliki akses live chat",
        data: [],
      });
    }

    const data = await ChatRoom.findAll({
      where: {
        [Op.or]: allowedServices.map((service) => ({
          service: {
            [Op.like]: `%${service}%`,
          },
        })),
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Room chat berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil room chat",
      error: error.message,
    });
  }
};

exports.buyerSendMessage = async (req, res) => {
  try {
    const { roomId, senderName, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Pesan tidak boleh kosong",
      });
    }

    const room = await ChatRoom.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    const buyerMessageCount = await ChatMessage.count({
      where: {
        roomId,
        senderType: "buyer",
      },
    });

    if (!room.isAccepted && buyerMessageCount >= 1) {
      return res.status(403).json({
        message:
          "Chat menunggu diterima admin. Kamu bisa lanjut chat setelah admin menerima room ini.",
      });
    }

    const data = await ChatMessage.create({
      roomId,
      senderName: senderName || "Buyer",
      senderType: "buyer",
      message: message.trim(),
    });

    const io = req.app.get("io");

    if (io) {
      io.to(String(roomId)).emit("receive_message", data);
    }

    res.status(201).json({
      message: "Pesan buyer berhasil dikirim",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengirim pesan buyer",
      error: error.message,
    });
  }
};

exports.adminReplyMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Pesan tidak boleh kosong",
      });
    }

    const role = req.user?.role;

    if (!["admin", "staff"].includes(role)) {
      return res.status(403).json({
        message: "Hanya admin atau staff yang dapat membalas chat",
      });
    }

    const room = await ChatRoom.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    if (!room.isAccepted) {
      return res.status(403).json({
        message: "Terima room chat terlebih dahulu sebelum membalas",
      });
    }

    const service = normalizeService(room.service);
    const allowedServices = getAllowedServicesByRole(role);
    const isAllowed = allowedServices.some((item) => service.includes(item));

    if (!isAllowed) {
      return res.status(403).json({
        message:
          role === "admin"
            ? "Admin hanya dapat membalas chat Vilog, Payout, dan Gifting"
            : "Staff hanya dapat membalas chat Limited Items",
      });
    }

    const data = await ChatMessage.create({
      roomId,
      senderName: req.user?.name || (role === "staff" ? "Staff" : "Admin"),
      senderType: role,
      message: message.trim(),
    });

    const io = req.app.get("io");

    if (io) {
      io.to(String(roomId)).emit("receive_message", data);
    }

    res.status(201).json({
      message: "Balasan berhasil dikirim",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membalas pesan",
      error: error.message,
    });
  }
};