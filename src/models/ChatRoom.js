const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const ChatRoom = sequelize.define('ChatRoom', {
  orderId: { type: DataTypes.STRING, allowNull: false },
  buyerName: { type: DataTypes.STRING },
});

module.exports = ChatRoom;
