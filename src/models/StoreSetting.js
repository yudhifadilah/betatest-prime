const { DataTypes } = require("sequelize");
const sequelize = require("../config/localdatabase");

const StoreSetting = sequelize.define(
  "StoreSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isStoreOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "store_settings",
    timestamps: true,
  }
);

module.exports = StoreSetting;