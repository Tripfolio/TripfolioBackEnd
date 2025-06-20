const express = require("express");
const router = express.Router();

const {
  createSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const uploadCover = require("../middlewares/uploadCover");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getSchedules } = require("../controllers/getSchedule");

router.post(
  "/",
  authenticateToken,
  uploadCover.single("cover"),
  createSchedule,
);
router.get("/user", authenticateToken, getSchedules);
router.delete("/:id", authenticateToken, deleteSchedule);

module.exports = router;
