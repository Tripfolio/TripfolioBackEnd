const express = require("express");
const router = express.Router();
const { addComment, deleteComment, getComment } = require("commentsCtrl");

router.get("/comments", getComment);
router.post("/comments", addComment);
router.delete("/comments", deleteComment);

module.exports = router;
