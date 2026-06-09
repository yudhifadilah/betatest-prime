const { Tumbal } = require("../models");

exports.create = async (req, res) => {
  try {
    const data = await Tumbal.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tumbal berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan tumbal",
      error: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Tumbal.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data tumbal",
      error: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const data = await Tumbal.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Tumbal tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil tumbal",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Tumbal.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Tumbal tidak ditemukan",
      });
    }

    await data.update(req.body);

    res.json({
      success: true,
      message: "Tumbal berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal update tumbal",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Tumbal.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Tumbal tidak ditemukan",
      });
    }

    await data.destroy();

    res.json({
      success: true,
      message: "Tumbal berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus tumbal",
      error: error.message,
    });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const data = await Tumbal.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Tumbal tidak ditemukan",
      });
    }

    await data.update({
      isActive: !data.isActive,
    });

    res.json({
      success: true,
      message: `Tumbal ${
        data.isActive ? "aktif" : "nonaktif"
      }`,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal update status",
      error: error.message,
    });
  }
};