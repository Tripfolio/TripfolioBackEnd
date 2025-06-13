const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const uploadPostImage = require("../middlewares/uploadPostImage");
const { createCommunityPost } = require("../controllers/community");

router.post(
  "/community-posts",
  authenticateToken,
  uploadPostImage.single("cover"),
  createCommunityPost
);

module.exports = router;
