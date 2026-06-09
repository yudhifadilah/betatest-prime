const { DataTypes } = require("sequelize");
const sequelize = require("../config/localdatabase");

const Tumbal = sequelize.define(
  "Tumbal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    namaItem: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    assetId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    harga: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "tumbals",
    timestamps: true,
  }
);

module.exports = Tumbal;