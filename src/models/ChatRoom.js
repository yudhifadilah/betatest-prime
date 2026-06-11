const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const ChatRoom = sequelize.define('ChatRoom', {
  orderId: { type: DataTypes.STRING, allowNull: true },
  buyerName: { type: DataTypes.STRING },
  service: {
  type: DataTypes.STRING,
  allowNull: true,
},
service: {
  type: DataTypes.STRING,
  allowNull: true,
},
isAccepted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
acceptedBy: {
  type: DataTypes.INTEGER,
  allowNull: true,
},
});

module.exports = ChatRoom;
