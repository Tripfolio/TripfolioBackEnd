const { db } = require("../config/db");
const { favorites } = require("../models/favoritesSchema");
const { communityPosts } = require("../models/post");
const { members } = require("../models/schema");
const { eq, and, desc } = require("drizzle-orm");

// 新增收藏
const addFavorite = async (req, res) => {
  try {
    const { postId, memberId } = req.body;

    // 檢查貼文是否存在
    const postExists = await db
      .select({ id: communityPosts.id })
      .from(communityPosts)
      .where(eq(communityPosts.id, postId))
      .limit(1);

    if (!postExists.length) {
      return res.status(404).json({ error: "貼文不存在" });
    }

    // 檢查是否已經收藏
    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.memberId, memberId), eq(favorites.postId, postId)),
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      return res.status(400).json({ error: "已經收藏過此貼文" });
    }

    // 新增收藏
    const [newFavorite] = await db
      .insert(favorites)
      .values({
        memberId,
        postId,
        createdAt: new Date(),
      })
      .returning();

    res.status(201).json({
      message: "收藏成功",
      favorite: newFavorite,
    });
  } catch (error) {
    console.error("新增收藏失敗:", error);
    res.status(500).json({ error: "新增收藏失敗" });
  }
};

// 移除收藏
const removeFavorite = async (req, res) => {
  try {
    const { postId } = req.params;
    const { memberId } = req.body;

    const deletedFavorite = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.memberId, memberId),
          eq(favorites.postId, parseInt(postId)),
        ),
      )
      .returning();

    if (!deletedFavorite.length) {
      return res.status(404).json({ error: "收藏記錄不存在" });
    }

    res.json({ message: "取消收藏成功" });
  } catch (error) {
    console.error("移除收藏失敗:", error);
    res.status(500).json({ error: "移除收藏失敗" });
  }
};

// 取得使用者收藏列表
const getFavorites = async (req, res) => {
  try {
    const { memberId } = req.params;

    const userFavorites = await db
      .select({
        favoriteId: favorites.id,
        createdAt: favorites.createdAt,
        // 貼文資訊
        postId: communityPosts.id,
        postTitle: communityPosts.title,
        postContent: communityPosts.content,
        postImageUrl: communityPosts.imageUrl,
        postLikes: communityPosts.likes,
        // 作者資訊
        authorId: communityPosts.authorId,
        authorName: members.name,
        authorAvatar: members.avatar,
      })
      .from(favorites)
      .leftJoin(communityPosts, eq(favorites.postId, communityPosts.id))
      .leftJoin(members, eq(communityPosts.authorId, members.id))
      .where(eq(favorites.memberId, parseInt(memberId)))
      .orderBy(desc(favorites.createdAt));

    res.json(userFavorites);
  } catch (error) {
    console.error("取得收藏列表失敗:", error);
    res.status(500).json({ error: "取得收藏列表失敗" });
  }
};

// 檢查是否已收藏
const checkFavorite = async (req, res) => {
  try {
    const { postId, memberId } = req.params;

    const favorite = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.memberId, parseInt(memberId)),
          eq(favorites.postId, parseInt(postId)),
        ),
      )
      .limit(1);

    res.json({ isFavorited: favorite.length > 0 });
  } catch (error) {
    console.error("檢查收藏狀態失敗:", error.message);
    res.status(500).json({ error: "檢查收藏狀態失敗" });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
};
