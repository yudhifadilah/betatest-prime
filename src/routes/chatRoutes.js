const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.post("/rooms", chatController.createRoom);
router.get("/rooms/:roomId/messages", chatController.getMessages);
router.get(
  "/rooms",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  chatController.getRooms
);
router.post("/buyer/send", chatController.buyerSendMessage);

router.post(
  "/admin/reply",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  chatController.adminReplyMessage
);

module.exports = router;