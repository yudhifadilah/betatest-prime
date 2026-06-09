const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VilogProduk = sequelize.define('VilogProduk', {
  namaProduk: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  harga: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = VilogProduk;
