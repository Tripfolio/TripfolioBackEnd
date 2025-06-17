const express = require("express");
const router = express.Router();
const {
  addComment,
  deleteComment,
  getComment,
} = require("../controllers/commentsCtrl");

router.get("/comments", getComment);
// router.get("/comments", (req, res) => {
//   getComment;
// });
router.post("/comments", addComment);
router.delete("/comments/:id", deleteComment);

module.exports = router;
