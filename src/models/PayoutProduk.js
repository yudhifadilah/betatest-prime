const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PayoutProduk = sequelize.define('PayoutProduk', {
  namaProduk: { type: DataTypes.STRING, allowNull: false },
  nominalRobux: { type: DataTypes.INTEGER, allowNull: false },
  harga: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = PayoutProduk;
