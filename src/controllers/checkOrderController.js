const { Op } = require("sequelize");
const {
  Order,
  VilogOrder,
  LimsOrder,
  PayoutOrder,
  GiftingOrder,
} = require("../models");

exports.checkOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID wajib diisi",
      });
    }

    const cleanOrderId = orderId.trim();

    const sources = [
      {
        type: "general",
        model: Order,
      },
      {
        type: "vilog",
        model: VilogOrder,
      },
      {
        type: "lims",
        model: LimsOrder,
      },
      {
        type: "payout",
        model: PayoutOrder,
      },
      {
        type: "gifting",
        model: GiftingOrder,
      },
    ].filter((source) => source.model);

    for (const source of sources) {
      const order = await source.model.findOne({
        where: {
          orderId: {
            [Op.eq]: cleanOrderId,
          },
        },
      });

      if (order) {
        return res.json({
          success: true,
          message: "Transaksi ditemukan",
          productType: source.type,
          data: {
            ...order.toJSON(),
            productType: source.type,
          },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: "Transaksi tidak ditemukan",
    });
  } catch (error) {
    console.error("CHECK ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengecek transaksi",
      error: error.message,
    });
  }
};