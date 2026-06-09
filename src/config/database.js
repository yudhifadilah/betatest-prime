const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    dialectModule: mysql2,
    logging: false,
  }
);

module.exports = sequelize;