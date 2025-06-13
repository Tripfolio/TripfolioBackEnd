const express = require("express");
const router = express.Router();

const { updateSchedule } = require("../controllers/updateScheduleController");
const uploadCover = require("../middlewares/uploadCover");
const { authenticateToken } = require("../middlewares/authMiddleware");


router.patch("/:id", authenticateToken, uploadCover.single("cover"), updateSchedule);

module.exports = router;