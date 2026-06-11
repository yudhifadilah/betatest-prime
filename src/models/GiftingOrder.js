const { DataTypes } = require("sequelize");
const sequelize = require("../config/localdatabase");

const GiftingOrder = sequelize.define("GiftingOrder", {
  orderId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  usernamePenerima: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  privateServerLink: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  namaMap: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  namaItem: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  jumlahRobux: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  nomorRekening: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  paymentProof: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  completionProof: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  giftingProdukId: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

  status: {
    type: DataTypes.ENUM(
      "unpaid",
      "pending",
      "processing",
      "completed",
      "cancelled"
    ),
    defaultValue: "pending",
  },
});

module.exports = GiftingOrder;