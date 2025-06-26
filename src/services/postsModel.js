const { db } = require('../config/db');
const { posts } = require('../models/postsSchema');
const { users } = require('../models/usersSchema');
const { comments } = require('../models/commentsSchema');
const { favorites } = require('../models/favoritesSchema');
const { schedules } = require('../models/scheduleSchema');
const { eq, sql } = require('drizzle-orm');

async function getPaginatedPosts(page = 1, limit = 15) {
  const offset = (page - 1) * limit;

  const postData = await db
    .select({
      id: posts.id,
      title: schedules.title,
      imageUrl: posts.coverURL,
      createdAt: posts.createdAt,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.memberId, users.id))
    .leftJoin(schedules, eq(posts.scheduleId, schedules.id))
    .orderBy(posts.createdAt.desc())
    .limit(limit)
    .offset(offset);

  const postIds = postData.map((p) => p.id);

  const commentCounts = await db
    .select({
      postId: comments.postId,
      count: sql`COUNT(*)`.as('count'),
    })
    .from(comments)
    .where(sql`${comments.postId} = ANY(${sql.array(postIds)})`)
    .groupBy(comments.postId);

  const favoriteCounts = await db
    .select({
      postId: favorites.postId,
      count: sql`COUNT(*)`.as('count'),
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