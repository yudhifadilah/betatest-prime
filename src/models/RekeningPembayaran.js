const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RekeningPembayaran = sequelize.define(
  "RekeningPembayaran",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodePembayaran: {
      type: DataTypes.ENUM("BANK", "EWALLET", "QRIS"),
      allowNull: false,
      defaultValue: "BANK",
    },
    namaBank: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nomorRekening: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    namaPemilik: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qrisImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "rekening_pembayaran",
    timestamps: true,
  }
);

module.exports = RekeningPembayaran;