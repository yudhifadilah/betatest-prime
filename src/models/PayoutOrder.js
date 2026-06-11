const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const PayoutOrder = sequelize.define('PayoutOrder', {
  orderId: { type: DataTypes.STRING, unique: true },
  robloxUsername: { type: DataTypes.STRING, allowNull: false },
  robloxUserId: { type: DataTypes.STRING },
  nomorRekening: { type: DataTypes.STRING, allowNull: false },
  paymentProof: { type: DataTypes.STRING },
  isJoinedGroup: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('unpaid', 'pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'unpaid',
  },
  productName: {
  type: DataTypes.STRING,
  allowNull: true,
},

totalPrice: {
  type: DataTypes.INTEGER,
  allowNull: true,
  defaultValue: 0,
},
});

module.exports = PayoutOrder;
