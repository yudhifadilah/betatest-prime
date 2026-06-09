require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { sequelize } = require("../src/models");

const authRoutes = require("../src/routes/authRoutes");
const vilogRoutes = require("../src/routes/vilogRoutes");
const payoutRoutes = require("../src/routes/payoutRoutes");
const limsRoutes = require("../src/routes/limsRoutes");
const rekeningRoutes = require("../src/routes/rekeningRoutes");
const communityRoutes = require("../src/routes/communityRoutes");
const chatRoutes = require("../src/routes/chatRoutes");
const tumbalRoutes = require("../src/routes/tumbalRoutes");
const storeRoutes = require("../src/routes/storeRoutes");
const checkOrderRoutes = require("../src/routes/checkOrderRoutes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "*";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "Roblox Topup API berjalan - Vercel Testing",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      status: "OK",
      mode: "vercel",
      socket: false,
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      mode: "vercel",
      socket: false,
      database: "failed",
      error: error.message,
    });
  }
});

app.get("/api/db-sync", async (req, res) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    res.json({
      message: "Database sync berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Database sync gagal",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/vilog", vilogRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/lims", limsRoutes);
app.use("/api/rekening", rekeningRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tumbal", tumbalRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/check-order", checkOrderRoutes);

module.exports = app;