const express = require("express");
const router = express.Router();

const giftingController = require("../controllers/giftingController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.get("/produk", giftingController.findAll);
router.get("/produk/:id", giftingController.findOne);

router.post(
  "/produk",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  giftingController.create
);

router.put(
  "/produk/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  giftingController.update
);

router.delete(
  "/produk/:id",
  authMiddleware,
  roleMiddleware("admin"),
  giftingController.remove
);

module.exports = router;