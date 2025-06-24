const { db } = require("../config/db");
const { communityPosts } = require("./post");
const { users } = require("./signUpSchema");
const { comments } = require("./commentsSchema");
const { favorites } = require("./favoritesSchema");
const { travelSchedules } = require("./scheduleSchema");
const { eq, sql, desc } = require("drizzle-orm");

async function getPaginatedPosts(page = 1, limit = 15) {
  const offset = (page - 1) * limit;

  const postData = await db
    .select({
      postId: communityPosts.id,
      content: communityPosts.content,
      coverURL: communityPosts.coverURL,
      createdAt: communityPosts.createdAt,
      scheduleTitle: travelSchedules.title,
      authorName: users.name,
      authorAvatar: users.avatar,
    })
    .from(communityPosts)
    .leftJoin(users, eq(communityPosts.memberId, users.id))
    .leftJoin(
      travelSchedules,
      eq(communityPosts.scheduleId, travelSchedules.id),
    )
    .orderBy(desc(communityPosts.createdAt))
    .limit(limit)
    .offset(offset);

  const postIds = postData.map((p) => p.postId);

  const commentCounts = await db
    .select({
      postId: comments.postId,
      count: sql`COUNT(*)`.as("count"),
    })
    .from(comments)
    .where(
      sql`${comments.postId} = ANY(${sql.raw(`ARRAY[${postIds.join(",")}]::integer[]`)})`,
    )
    .groupBy(comments.postId);

  const favoriteCounts = await db
    .select({
      postId: favorites.postId,
      count: sql`COUNT(*)`.as("count"),
    })
    .from(favorites)
    .where(
      sql`${favorites.postId} = ANY(${sql.raw(`ARRAY[${postIds.join(",")}]::integer[]`)})`,
    )
    .groupBy(favorites.postId);

  const commentMap = Object.fromEntries(
    commentCounts.map((c) => [c.postId, Number(c.count)]),
  );
  const favoriteMap = Object.fromEntries(
    favoriteCounts.map((f) => [f.postId, Number(f.count)]),
  );

  const enriched = postData.map((post) => ({
    ...post,
    commentCount: commentMap[post.postId] || 0,
    favoriteCount: favoriteMap[post.postId] || 0,
  }));

  return enriched;
}

module.exports = {
  getPaginatedPosts,
};
