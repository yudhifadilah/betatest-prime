const { VilogOrder, VilogProduk } = require("../models");
const makeOrderCode = require("../utils/makeOrderCode");
const { encryptText, decryptText } = require("../utils/cryptoHelper");

const decryptVilogOrder = (order) => {
  const plain = order.toJSON ? order.toJSON() : order;

  return {
    ...plain,
    robloxPassword: decryptText(plain.robloxPassword),
    backupCode: decryptText(plain.backupCode),
  };
};

exports.createOrder = async (req, res) => {
  try {
    const {
      vilogProdukId,
      robloxUsername,
      robloxPassword,
      backupCode,
      contact,
      nomorRekening,
    } = req.body;

    const produk = await VilogProduk.findByPk(vilogProdukId);

    if (!produk || !produk.isActive) {
      return res.status(404).json({
        message: "Produk vilog tidak ditemukan atau tidak aktif",
      });
    }

    if (!robloxUsername || !robloxPassword || !backupCode || !contact) {
      return res.status(400).json({
        message: "Username, password, backup code, dan contact wajib diisi",
      });
    }

    const paymentProof = req.file ? req.file.path : null;

const order = await VilogOrder.create({
  orderId: makeOrderCode("VILOG"),
  vilogProdukId,
  productName: produk.namaProduk,
  totalPrice: produk.harga,
  robloxUsername,
  robloxPassword,
  backupCode,
  contact,
  nomorRekening,
  paymentProof,
  status: paymentProof ? "pending" : "unpaid",
});

    res.status(201).json({
      message: "Order vilog berhasil dibuat",
      data: {
        ...order.toJSON(),
        robloxPassword: undefined,
        backupCode: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat order vilog",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await VilogOrder.findAll({
      include: VilogProduk,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: data.map(decryptVilogOrder),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil order vilog",
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const data = await VilogOrder.findByPk(req.params.id, {
      include: VilogProduk,
    });

    if (!data) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    res.json({
      data: decryptVilogOrder(data),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail order vilog",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = await VilogOrder.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status wajib diisi",
      });
    }

    if (status === "completed" && !req.file) {
      return res.status(400).json({
        message: "Bukti screenshot wajib diupload ketika status completed",
      });
    }

    const updateData = {
      status,
    };

    if (status === "completed") {
      updateData.completionProof = req.file.path;
      updateData.completedAt = new Date();
    }

    await data.update(updateData);

    res.json({
      message: "Status order vilog berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update status order vilog",
      error: error.message,
    });
  }
};