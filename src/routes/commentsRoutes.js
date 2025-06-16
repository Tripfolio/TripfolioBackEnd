const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
  getComment,
} = require("../controllers/commentsCtrl");

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
// router.get("/comments", getComment);
router.get("/comments", (req, res) => {
  res.json(mockPosts);
});
router.post("/comments", addComment);
router.delete("/comments/:id", deleteComment);

module.exports = router;
