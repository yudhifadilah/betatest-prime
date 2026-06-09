const { ChatRoom, ChatMessage } = require("../models");

exports.createRoom = async (req, res) => {
  try {
    const data = await ChatRoom.create(req.body);

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

exports.getMessages = async (req, res) => {
  try {
    const data = await ChatMessage.findAll({
      where: {
        roomId: req.params.roomId,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      data,
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
    const data = await ChatRoom.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Room chat berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("GET CHAT ROOMS ERROR:", error);
    res.status(500).json({
      message: "Gagal mengambil room chat",
    });
  }
};

exports.buyerSendMessage = async (req, res) => {
  try {
    const { roomId, senderName, message } = req.body;

    const room = await ChatRoom.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    const data = await ChatMessage.create({
      roomId,
      senderName: senderName || "Buyer",
      senderType: "buyer",
      message,
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

    const room = await ChatRoom.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room chat tidak ditemukan",
      });
    }

    const data = await ChatMessage.create({
      roomId,
      senderName: req.user?.name || "Admin",
      senderType: req.user?.role || "admin",
      message,
    });

    const io = req.app.get("io");

    if (io) {
      io.to(String(roomId)).emit("receive_message", data);
    }

    res.status(201).json({
      message: "Balasan admin berhasil dikirim",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membalas pesan",
      error: error.message,
    });
  }
};