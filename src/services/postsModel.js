const { db } = require('../config/db');
const { posts } = require('../models/postsSchema');
const { users } = require('../models/usersSchema');
const { comments } = require('../models/commentsSchema');
const { favorites } = require('../models/favoritesSchema');
const { schedules } = require('../models/scheduleSchema');
const { eq, sql, desc, inArray } = require('drizzle-orm');

async function getPaginatedPosts(page = 1, limit = 15) {
  const offset = (page - 1) * limit;

  const postData = await db
    .select({
      postId: posts.id,
      title: schedules.title,
      imageUrl: posts.coverURL,
      createdAt: posts.createdAt,
      authorName: users.name,
      authorAvatar: users.avatar,
      content: posts.content,
      id: users.id
    })
    .from(posts)
    .leftJoin(users, eq(posts.memberId, users.id))
    .leftJoin(schedules, eq(posts.scheduleId, schedules.id))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  const postIds = postData.map((p) => p.postId);
 
  // 如果沒有貼文，直接回傳空結果
  if (postIds.length === 0) {

    return postData.map((post) => ({
      ...post,
      commentCount: 0,
      favoriteCount: 0,
    }));
  }

  const commentCounts = await db
    .select({
      postId: comments.postId,
      count: sql`COUNT(*)`.as('count'),
    })
    .from(comments)
    .where(inArray(comments.postId, postIds))
    .groupBy(comments.postId);

  const favoriteCounts = await db
    .select({
      postId: favorites.postId,
      count: sql`COUNT(*)`.as('count'),
    })
    .from(favorites)
    .where(inArray(favorites.postId, postIds))
    .groupBy(favorites.postId);

  const commentMap = Object.fromEntries(commentCounts.map((c) => [c.postId, Number(c.count)]));
  const favoriteMap = Object.fromEntries(favoriteCounts.map((f) => [f.postId, Number(f.count)]));

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