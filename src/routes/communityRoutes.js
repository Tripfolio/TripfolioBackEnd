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

const mockPosts = [
  {
    id: 1,
    title: "美麗的台北101",
    content: "今天去台北101拍照，風景超美！",
    imageUrl: "https://example.com/image1.jpg",
    authorName: "小明",
    authorAvatar: "https://example.com/avatar1.jpg",
    likes: 15,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "墾丁海邊度假",
    content: "墾丁的海真的很藍很美，推薦大家來玩！",
    imageUrl: "https://example.com/image2.jpg",
    authorName: "小華",
    authorAvatar: "https://example.com/avatar2.jpg",
    likes: 23,
    createdAt: new Date(),
  },
];
router.get("/community-posts", (req, res) => {
  res.json(mockPosts);
});

router.post(
  "/community-posts",
  authenticateToken,
  uploadPostImage.single("cover"),
  createCommunityPost,
);
// router.get('/community-posts', getAllCommunityPosts);
router.put(
  "/community-posts/:id",
  authenticateToken,
  uploadPostImage.single("cover"),
  updateCommunityPost,
);
router.delete("/community-posts/:id", authenticateToken, deleteCommunityPost);

module.exports = router;
