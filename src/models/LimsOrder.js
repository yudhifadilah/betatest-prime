const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const LimsOrder = sequelize.define('LimsOrder', {
  orderId: { type: DataTypes.STRING, unique: true },
  robloxUsername: { type: DataTypes.STRING, allowNull: false },
  nomorRekening: { type: DataTypes.STRING, allowNull: false },
  paymentProof: { type: DataTypes.STRING },
  rolimonsStatus: { type: DataTypes.STRING },
  tumbalAvailable: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('unpaid', 'pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'unpaid',
  },
});

module.exports = LimsOrder;
