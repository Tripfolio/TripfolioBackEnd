const { db } = require("../config/db");
// const { communityPosts } = require("./post"); //需確認有貼文資料表
const { users } = require("./signUpSchema");
// const { comments } = require("./comments"); //需確認有留言資料表
// const { favorites } = require("./favorites"); //需確認有收藏資料表
const { travelSchedules } = require("./scheduleSchema");
const { eq, sql } = require("drizzle-orm");

async function getPaginatedPosts(page = 1, limit = 15) {
  const offset = (page - 1) * limit;

  const postData = await db
    .select({
      id: communityPosts.id,
      title: travelSchedules.title,
      imageUrl: communityPosts.coverURL,
      createdAt: communityPosts.createdAt,
      authorName: users.name,
    })
    .from(communityPosts)
    .leftJoin(users, eq(communityPosts.memberId, users.id))
    .leftJoin(
      travelSchedules,
      eq(communityPosts.scheduleId, travelSchedules.id),
    )
    .orderBy(communityPosts.createdAt.desc())
    .limit(limit)
    .offset(offset);

  const postIds = postData.map((p) => p.id);

  const commentCounts = await db
    .select({
      postId: comments.postId,
      count: sql`COUNT(*)`.as("count"),
    })
    .from(comments)
    .where(sql`${comments.postId} = ANY(${sql.array(postIds)})`)
    .groupBy(comments.postId);

  const favoriteCounts = await db
    .select({
      postId: favorites.postId,
      count: sql`COUNT(*)`.as("count"),
    })
    .from(favorites)
    .where(sql`${favorites.postId} = ANY(${sql.array(postIds)})`)
    .groupBy(favorites.postId);

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
