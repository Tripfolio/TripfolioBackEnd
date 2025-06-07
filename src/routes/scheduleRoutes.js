const express = require("express");
const router = express.Router();

const { createSchedule } = require("../controllers/scheduleController");
const uploadCover = require("../middlewares/uploadCover");
const { authenticateToken } = require("../middlewares/authMiddleware")

router.post("/", authenticateToken, uploadCover.single("cover"), createSchedule);

module.exports = router;