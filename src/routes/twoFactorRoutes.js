const express = require("express");
const router = express.Router();

const twoFactorController = require("../controllers/twoFactorController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/status", authMiddleware, twoFactorController.getStatus);
router.post("/generate", authMiddleware, twoFactorController.generate2FA);
router.post("/enable", authMiddleware, twoFactorController.enable2FA);
router.post("/disable", authMiddleware, twoFactorController.disable2FA);

module.exports = router;