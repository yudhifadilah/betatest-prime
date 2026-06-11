const { DataTypes } = require("sequelize");
const sequelize = require("../config/localdatabase");

const GiftingProduk = sequelize.define("GiftingProduk", {
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = GiftingProduk;