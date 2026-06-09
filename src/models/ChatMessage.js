const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  senderName: { type: DataTypes.STRING, allowNull: false },
  senderType: { type: DataTypes.ENUM('buyer', 'admin', 'staff'), defaultValue: 'buyer' },
  message: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = ChatMessage;
