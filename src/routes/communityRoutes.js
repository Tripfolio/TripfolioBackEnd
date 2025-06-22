const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const uploadPostImage = require("../middlewares/uploadPostImage");
const {
  createCommunityPost,
  getAllCommunityPosts,
  updateCommunityPost,
  deleteCommunityPost,
} = require("../controllers/community");

router.post(
  "/community-posts",
  authenticateToken,
  uploadPostImage.single("cover"),
  createCommunityPost,
);
router.get("/", getAllCommunityPosts);
router.put(
  "/community-posts/:id",
  authenticateToken,
  uploadPostImage.single("cover"),
  updateCommunityPost,
);
router.delete("/community-posts/:id", authenticateToken, deleteCommunityPost);

module.exports = router;
