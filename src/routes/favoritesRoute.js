// routes/favorites.js
const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} = require("../controllers/favoritesCtrl");

// 新增收藏
router.post("/", addFavorite);

// 移除收藏
router.delete("/:postId", removeFavorite);

// 取得使用者的收藏列表
router.get("/user/:memberId", getFavorites);

// 檢查是否已收藏
router.get("/check/:postId/:memberId", checkFavorite);

module.exports = router;
