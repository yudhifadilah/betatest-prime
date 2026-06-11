const { GiftingOrder, GiftingProduk } = require("../models");
const makeOrderCode = require("../utils/makeOrderCode");

const getFilePath = (file) => {
  if (!file) return null;
  return file.path ? file.path.replace(/\\/g, "/") : null;
};

exports.createOrder = async (req, res) => {
  try {
    const {
      usernamePenerima,
      privateServerLink,
      namaMap,
      namaItem,
      jumlahRobux,
      nomorRekening,
    } = req.body;

    if (!usernamePenerima) {
      return res.status(400).json({
        message: "Username penerima wajib diisi",
      });
    }

    if (!namaMap) {
      return res.status(400).json({
        message: "Nama map wajib diisi",
      });
    }

    if (!namaItem) {
      return res.status(400).json({
        message: "Nama item / gamepass wajib diisi",
      });
    }

    if (!jumlahRobux || Number(jumlahRobux) <= 0) {
      return res.status(400).json({
        message: "Jumlah robux wajib lebih dari 0",
      });
    }

    if (!nomorRekening) {
      return res.status(400).json({
        message: "Nomor rekening wajib diisi",
      });
    }

    const rateData = await GiftingProduk.findOne({
      where: {
        isActive: true,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!rateData) {
      return res.status(404).json({
        message: "Rate gifting aktif belum tersedia",
      });
    }

    const paymentProof = getFilePath(req.file);

    const giftingProdukId = rateData.id;
    const rate = Number(rateData.rate || 0);
    const totalPrice = rate * Number(jumlahRobux);

    const order = await GiftingOrder.create({
      orderId: makeOrderCode("GIFTING"),

      giftingProdukId,

      usernamePenerima,
      privateServerLink: privateServerLink || null,
      namaMap,
      namaItem,
      jumlahRobux: Number(jumlahRobux),

      rate,
      totalPrice,

      nomorRekening,
      paymentProof,

      status: paymentProof ? "pending" : "unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "Order gifting berhasil dibuat",
      data: order,
    });
  } catch (error) {
    console.error("CREATE GIFTING ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat order gifting",
      error: error.message,
    });
  }
};

exports.getOrderByOrderId = async (req, res) => {
  try {
    const data = await GiftingOrder.findOne({
      where: {
        orderId: req.params.orderId,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Order gifting tidak ditemukan",
      });
    }

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil order gifting",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await GiftingOrder.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil order gifting",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await GiftingOrder.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    const { status } = req.body;
    const completionProof = getFilePath(req.file);

    await order.update({
      status,
      completionProof:
        completionProof || order.completionProof,

      completedAt:
        status === "completed"
          ? new Date()
          : order.completedAt,
    });

    return res.json({
      message: "Status gifting berhasil diperbarui",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal update status gifting",
      error: error.message,
    });
  }
};