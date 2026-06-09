const express = require("express");
const router = express.Router();

const storeController = require("../controllers/storeController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.get("/status", storeController.getStoreStatus);

router.put(
  "/toggle",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  storeController.toggleStore
);

module.exports = router;