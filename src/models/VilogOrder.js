const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const VilogOrder = sequelize.define('VilogOrder', {
  orderId: { type: DataTypes.STRING, unique: true },
  robloxUsername: { type: DataTypes.STRING, allowNull: false },
  robloxPassword: { type: DataTypes.STRING, allowNull: false },
  backupCode: { type: DataTypes.TEXT, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: false },
  nomorRekening: { type: DataTypes.STRING, allowNull: false },
  paymentProof: { type: DataTypes.STRING },
  completionProof: {
  type: DataTypes.STRING,
  allowNull: true,
  
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

completedAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
  status: {
    type: DataTypes.ENUM('unpaid', 'pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'unpaid',
  },
});

module.exports = VilogOrder;
