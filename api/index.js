require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("../src/routes/authRoutes");
const vilogRoutes = require("../src/routes/vilogRoutes");
const payoutRoutes = require("../src/routes/payoutRoutes");
const limsRoutes = require("../src/routes/limsRoutes");
const rekeningRoutes = require("../src/routes/rekeningRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "API Roblox Topup berjalan di Vercel",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/vilog", vilogRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/lims", limsRoutes);
app.use("/api/rekening", rekeningRoutes);

module.exports = app;