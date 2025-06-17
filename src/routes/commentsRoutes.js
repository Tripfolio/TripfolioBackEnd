const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
  getCommentsByPost,
} = require("../controllers/commentsCtrl");

let fakeComments = [
  {
    id: 1,
    content: ["很棒的分享！"],
    userName: "旅遊愛好者",
    userAvatar: "https://via.placeholder.com/32",
    createdAt: "2025-06-17T10:30:00Z",
    postId: 2,
  },
  {
    id: 2,
    content: "我也想去這個地方",
    userName: "背包客小李",
    userAvatar: "https://via.placeholder.com/32",
    createdAt: "2025-06-17T11:15:00Z",
    postId: 2,
  },
];

// router.get("/:postId/comments", getCommentsByPost);
// 取得留言
router.get("/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const postComments = fakeComments.filter(
    (comment) => comment.postId === parseInt(postId),
  );
  res.json(postComments);
});

router.post("/:postId/comments", addComment);

router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
