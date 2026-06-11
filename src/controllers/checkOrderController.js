const { Op } = require("sequelize");
const {
  Order,
  VilogOrder,
  LimsOrder,
  PayoutOrder,
  GiftingOrder,
} = require("../models");

const getOrderPrice = (order) => {
  const data = order.toJSON ? order.toJSON() : order;

  return (
    data.totalPrice ||
    data.totalHarga ||
    data.price ||
    data.harga ||
    data.amount ||
    data.total ||
    data.nominal ||
    data.productPrice ||
    data.hargaProduk ||
    0
  );
};

const getProductName = (order, type) => {
  const data = order.toJSON ? order.toJSON() : order;

  if (type === "gifting") {
    return data.namaItem || "-";
  }

  return (
    data.productName ||
    data.namaProduk ||
    data.namaProduct ||
    data.produkName ||
    data.namaItem ||
    "-"
  );
};

const getCompletionProof = (order) => {
  const data = order.toJSON ? order.toJSON() : order;

  return (
    data.completionProof ||
    data.proofDone ||
    data.buktiSelesai ||
    data.adminProof ||
    data.completedProof ||
    null
  );
};

exports.checkOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID wajib diisi",
      });
    }

    const cleanOrderId = String(orderId).trim();

    if (!cleanOrderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID tidak valid",
      });
    }

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
        const orderData = order.toJSON();
        const totalPrice = Number(getOrderPrice(orderData)) || 0;

        return res.json({
          success: true,
          message: "Transaksi ditemukan",
          productType: source.type,
          data: {
            ...orderData,

            productType: source.type,

            // Untuk gifting otomatis ambil dari namaItem
            // Untuk order lain tetap pakai productName / namaProduk
            productName: getProductName(orderData, source.type),

            totalPrice,
            totalHarga: totalPrice,

            completionProof: getCompletionProof(orderData),
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