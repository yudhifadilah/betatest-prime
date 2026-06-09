const express = require("express");
const router = express.Router();

const checkOrderController = require("../controllers/checkOrderController");

router.get("/:orderId", checkOrderController.checkOrderByOrderId);

module.exports = router;