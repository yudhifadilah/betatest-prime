const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const RobloxCommunity = sequelize.define('RobloxCommunity', {
  groupId: { type: DataTypes.STRING, allowNull: false, unique: true },
  groupName: { type: DataTypes.STRING, allowNull: false },
  groupLink: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = RobloxCommunity;
