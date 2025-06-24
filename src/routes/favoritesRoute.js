const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} = require("../controllers/favoritesCtrl");

router.post("/", addFavorite);

router.delete("/:postId", removeFavorite);

router.get("/user/:memberId", getFavorites);

router.get("/check/:postId/:memberId", checkFavorite);

module.exports = router;
