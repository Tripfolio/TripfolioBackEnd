const express = require("express");
const router = express.Router();

const {
  createSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const uploadCover = require("../middlewares/uploadCover");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getSchedules } = require("../controllers/getSchedule");

const { getSchedulesByMemberId } = require("../controllers/scheduleController")

router.post(
  "/",
  authenticateToken,
  uploadCover.single("cover"),
  createSchedule,
);
router.get("/", authenticateToken, getSchedules);
router.delete("/:id", authenticateToken, deleteSchedule);
router.get("/member/:memberId", getSchedulesByMemberId);

module.exports = router;