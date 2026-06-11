const { GiftingProduk } = require("../models");

exports.create = async (req, res) => {
  try {
    const { rate, isActive } = req.body;

    if (!rate || Number(rate) <= 0) {
      return res.status(400).json({
        message: "Rate wajib lebih dari 0",
      });
    }

    const data = await GiftingProduk.create({
      rate: Number(rate),
      isActive: isActive === undefined ? true : Boolean(isActive),
    });

    res.status(201).json({
      message: "Rate gifting berhasil dibuat",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat rate gifting",
      error: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await GiftingProduk.findAll({
      attributes: ["id", "rate", "isActive", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil rate gifting",
      error: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const data = await GiftingProduk.findByPk(req.params.id, {
      attributes: ["id", "rate", "isActive", "createdAt", "updatedAt"],
    });

    if (!data) {
      return res.status(404).json({
        message: "Rate gifting tidak ditemukan",
      });
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail rate gifting",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await GiftingProduk.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Rate gifting tidak ditemukan",
      });
    }

    const { rate, isActive } = req.body;

    if (rate !== undefined && Number(rate) <= 0) {
      return res.status(400).json({
        message: "Rate wajib lebih dari 0",
      });
    }

    await data.update({
      rate: rate !== undefined ? Number(rate) : data.rate,
      isActive: isActive !== undefined ? Boolean(isActive) : data.isActive,
    });

    res.json({
      message: "Rate gifting berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate rate gifting",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await GiftingProduk.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Rate gifting tidak ditemukan",
      });
    }

    await data.destroy();

    res.json({
      message: "Rate gifting berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus rate gifting",
      error: error.message,
    });
  }
};