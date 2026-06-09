const express = require("express");
const router = express.Router();

const tumbalController = require("../controllers/tumbalController");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");

const {
  roleMiddleware,
} = require("../middleware/roleMiddleware");

// GET ALL
router.get("/", tumbalController.findAll);

// GET ONE
router.get("/:id", tumbalController.findOne);

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  tumbalController.create
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  tumbalController.update
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  tumbalController.remove
);

// TOGGLE ACTIVE
router.patch(
  "/toggle/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  tumbalController.toggleStatus
);

module.exports = router;