const express = require("express");
const router = express.Router();

const rekeningController = require("../controllers/rekeningController");
const uploadQris = require("../middleware/uploadQrisMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

router.get(
  "/",
  rekeningController.findAll
);

router.get(
  "/global",
  rekeningController.findAllGlobal
);

router.get("/active", rekeningController.findActive);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  rekeningController.findOne
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  uploadQris.single("qrisImage"),
  rekeningController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  uploadQris.single("qrisImage"),
  rekeningController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  rekeningController.remove
);

module.exports = router;
