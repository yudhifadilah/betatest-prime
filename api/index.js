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
const giftingRoutes = require("../src/routes/giftingRoutesOrder");
const storeRoutes = require("../src/routes/storeRoutes");
const checkOrderRoutes = require("../src/routes/checkOrderRoutes");
const twoFactorRoutes = require("../src/routes/twoFactorRoutes");
const giftingOrderRoutes = require(
  "../src/routes/giftingRoutes"
);

const app = express();

/* ==========================
   CORS
========================== */

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/+$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/+$/, "");

      const allowed =
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app");

      if (allowed) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: ${cleanOrigin}`)
      );
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],
  })
);

app.options("*", cors());

/* ==========================
   MIDDLEWARE
========================== */

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ==========================
   STATIC
========================== */

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

/* ==========================
   HEALTH CHECK
========================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Roblox Topup API berjalan",
    mode: "vercel",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    return res.json({
      success: true,
      status: "OK",
      database: "connected",
      mode: "vercel",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      database: "failed",
      error: error.message,
    });
  }
});

/* ==========================
   ROUTES
========================== */

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
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/gifting", giftingRoutes);
app.use("/api/gifting", giftingOrderRoutes);

/* ==========================
   DATABASE
========================== */

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error(
      "Database error:",
      error.message
    );
  });

module.exports = app;