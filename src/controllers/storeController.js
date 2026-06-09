const { StoreSetting } = require("../models");

exports.getStoreStatus = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();

    if (!setting) {
      setting = await StoreSetting.create({
        isStoreOpen: true,
      });
    }

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleStore = async (req, res) => {
  try {
    const { isStoreOpen } = req.body;

    let setting = await StoreSetting.findOne();

    if (!setting) {
      setting = await StoreSetting.create({
        isStoreOpen,
      });
    } else {
      setting.isStoreOpen = isStoreOpen;
      await setting.save();
    }

    res.json({
      success: true,
      message: isStoreOpen
        ? "Toko berhasil dibuka"
        : "Toko berhasil ditutup",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};