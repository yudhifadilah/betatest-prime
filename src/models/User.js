const { DataTypes } = require('sequelize');
const sequelize = require('../config/localdatabase');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'staff', 'buyer'), defaultValue: 'buyer' },
});

module.exports = User;
