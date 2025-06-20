const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
  getCommentsByPost,
} = require("../controllers/commentsCtrl");

router.get("/:postId/comments", getCommentsByPost);

router.post("/:postId/comments", addComment);

router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
