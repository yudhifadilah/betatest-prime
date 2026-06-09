const express = require("express");
const router = express.Router();
const vilogController = require("../controllers/vilogController");
const vilogOrderController = require("../controllers/vilogOrderController");
const uploadPayment = require("../middleware/uploadMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.get("/produk", vilogController.findAll);
router.get("/produk/:id", vilogController.findOne);
router.post(
  "/produk",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  vilogController.create,
);
router.put(
  "/produk/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  vilogController.update,
);
router.delete(
  "/produk/:id",
  authMiddleware,
  roleMiddleware("admin"),
  vilogController.remove,
);

router.post(
  "/order",
  uploadPayment.single("paymentProof"),
  vilogOrderController.createOrder,
);
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  vilogOrderController.getOrders,
);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  uploadPayment.single("completionProof"),
  vilogOrderController.updateStatus,
);
module.exports = router;
