const express = require("express");
const router = express.Router();

const giftingOrderController = require("../controllers/giftingOrderController");

const uploadPayment = require("../middleware/uploadMiddleware");

const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.post(
  "/order",
  uploadPayment.single("paymentProof"),
  giftingOrderController.createOrder
);

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  giftingOrderController.getOrders
);

router.get(
  "/orders/:orderId",
  giftingOrderController.getOrderByOrderId
);

router.patch(
  "/orders/:id/status",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  uploadPayment.single("completionProof"),
  giftingOrderController.updateStatus
);

module.exports = router;