const db = require("../config/db");
const { posts } = require("./post"); //需確認有貼文資料表
const { users } = require("./schema"); //需確認有使用者資料表
const { comments } = require("./commentsSchema"); //需確認有留言資料表
const { favorites } = require("./favoritesSchema"); //需確認有收藏資料表
const { eq, sql, count } = require("drizzle-orm");

async function getPaginatedPosts(page = 1, limit = 15) {
  const offset = (page - 1) * limit;

  const postData = await db
    .select({
      id: posts.id,
      title: posts.title,
      imageUrl: posts.image_url,
      createdAt: posts.created_at,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.user_id, users.id))
    .orderBy(posts.created_at.desc())
    .limit(limit)
    .offset(offset);

  const postIds = postData.map((p) => p.id);

  const commentCounts = await db
    .select({
      postId: comments.post_id,
      count: sql`COUNT(*)`.as("count"),
    })
    .from(comments)
    .where(sql`${comments.post_id} = ANY(${sql.array(postIds)})`)
    .groupBy(comments.post_id);

  const favoriteCounts = await db
    .select({
      postId: favorites.post_id,
      count: sql`COUNT(*)`.as("count"),
    })
    .from(favorites)
    .where(sql`${favorites.post_id} = ANY(${sql.array(postIds)})`)
    .groupBy(favorites.post_id);

  const commentMap = Object.fromEntries(
    commentCounts.map((c) => [c.postId, Number(c.count)]),
  );
  const favoriteMap = Object.fromEntries(
    favoriteCounts.map((f) => [f.postId, Number(f.count)]),
  );

  const enriched = postData.map((post) => ({
    ...post,
    commentCount: commentMap[post.id] || 0,
    favoriteCount: favoriteMap[post.id] || 0,
  }));

  return enriched;
}

module.exports = {
  getPaginatedPosts,
};
