const express = require("express");
const router = express.Router();
const { getAllPosts } = require("../controllers/allPostCtrl");

router.get("/", getAllPosts);

module.exports = router;
