const fs = require("fs");
const path = require("path");
const { RekeningPembayaran, User } = require("../models");

const deleteFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await RekeningPembayaran.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Data rekening dashboard berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("Find rekening error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.findAllGlobal = async (req, res) => {
  try {
    const data = await RekeningPembayaran.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Semua data rekening berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("Find global rekening error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.findActive = async (req, res) => {
  try {
    const where = {
      isActive: true,
    };

    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    const data = await RekeningPembayaran.findAll({
      where,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Data rekening aktif berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("Find active rekening error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RekeningPembayaran.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Rekening tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Detail rekening berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("Find one rekening error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      metodePembayaran,
      namaBank,
      nomorRekening,
      namaPemilik,
      isActive,
    } = req.body;

    if (!metodePembayaran) {
      return res.status(400).json({
        success: false,
        message: "Metode pembayaran wajib diisi",
      });
    }

    if (!["BANK", "EWALLET", "QRIS"].includes(metodePembayaran)) {
      return res.status(400).json({
        success: false,
        message: "Metode pembayaran tidak valid",
      });
    }

    if (metodePembayaran === "QRIS" && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Gambar QRIS wajib diupload",
      });
    }

    if (metodePembayaran !== "QRIS") {
      if (!namaBank || !nomorRekening || !namaPemilik) {
        return res.status(400).json({
          success: false,
          message: "Nama bank/e-wallet, nomor, dan nama pemilik wajib diisi",
        });
      }
    }

    const qrisImage = req.file ? `/uploads/qris/${req.file.filename}` : null;

    const data = await RekeningPembayaran.create({
      userId: req.user.id,
      metodePembayaran,
      namaBank: metodePembayaran === "QRIS" ? null : namaBank,
      nomorRekening: metodePembayaran === "QRIS" ? null : nomorRekening,
      namaPemilik: metodePembayaran === "QRIS" ? null : namaPemilik,
      qrisImage,
      isActive: isActive === "false" ? false : true,
    });

    res.status(201).json({
      success: true,
      message: "Rekening pembayaran berhasil ditambahkan",
      data,
    });
  } catch (error) {
    console.error("Create rekening error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RekeningPembayaran.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Rekening tidak ditemukan",
      });
    }

    const {
      metodePembayaran,
      namaBank,
      nomorRekening,
      namaPemilik,
      isActive,
    } = req.body;

    const selectedMethod = metodePembayaran || data.metodePembayaran;

    if (!["BANK", "EWALLET", "QRIS"].includes(selectedMethod)) {
      return res.status(400).json({
        success: false,
        message: "Metode pembayaran tidak valid",
      });
    }

    let qrisImage = data.qrisImage;

    if (req.file) {
      deleteFile(data.qrisImage);
      qrisImage = `/uploads/qris/${req.file.filename}`;
    }

    if (selectedMethod === "QRIS" && !qrisImage) {
      return res.status(400).json({
        success: false,
        message: "Gambar QRIS wajib diupload",
      });
    }

    if (selectedMethod !== "QRIS") {
      deleteFile(data.qrisImage);
      qrisImage = null;

      if (!namaBank || !nomorRekening || !namaPemilik) {
        return res.status(400).json({
          success: false,
          message: "Nama bank/e-wallet, nomor, dan nama pemilik wajib diisi",
        });
      }
    }

    await data.update({
      metodePembayaran: selectedMethod,
      namaBank: selectedMethod === "QRIS" ? null : namaBank,
      nomorRekening: selectedMethod === "QRIS" ? null : nomorRekening,
      namaPemilik: selectedMethod === "QRIS" ? null : namaPemilik,
      qrisImage,
      isActive:
        typeof isActive === "undefined"
          ? data.isActive
          : isActive === "true" || isActive === true,
    });

    res.json({
      success: true,
      message: "Rekening pembayaran berhasil diupdate",
      data,
    });
  } catch (error) {
    console.error("Update rekening error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RekeningPembayaran.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Rekening tidak ditemukan",
      });
    }

    deleteFile(data.qrisImage);

    await data.destroy();

    res.json({
      success: true,
      message: "Rekening pembayaran berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete rekening error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};