const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LimsProduk = sequelize.define('LimsProduk', {
  namaItem: { type: DataTypes.STRING, allowNull: false },
  assetId: { type: DataTypes.STRING, allowNull: false },
  harga: { type: DataTypes.INTEGER, allowNull: false },
  isTumbalAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = LimsProduk;
