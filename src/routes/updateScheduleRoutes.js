const express = require("express");
const router = express.Router();

const {
  updateSchedule,
  addDayToSchedule,
  getTravelScheduleById,
} = require("../controllers/updateScheduleController");
const uploadCover = require("../middlewares/uploadCover");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyShareToken } = require("../middlewares/shareMiddleware");

router.patch(
  "/:id",
  authenticateToken,
  uploadCover.single("cover"),
  verifyShareToken("editor"),
  updateSchedule,
);

router.post(
  "/:id/addDay",
  authenticateToken,
  verifyShareToken("editor"),
  addDayToSchedule,
);

router.get("/:id", authenticateToken, getTravelScheduleById);

module.exports = router;
