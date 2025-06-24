const { db } = require('../config/db');
const { posts } = require('../models/postsSchema');
const { schedules } = require('../models/scheduleSchema');
const { users } = require('../models/usersSchema');
const { eq, and } = require('drizzle-orm');
const HTTP = require('../constants/httpStatus');

// 建立社群貼文
async function createCommunityPost(req, res) {
  try {
    const memberId = req.user.id;
    const { scheduleId, content } = req.body;
    const coverURL = req.file?.location || req.body.coverURL || null;

    const result = await db.insert(posts).values({
      memberId,
      scheduleId: Number(scheduleId),
      content,
      coverURL,
      createdAt: new Date(),
    });

    return res.status(HTTP.CREATED).json({
      success: true,
      message: '社群貼文已建立',
      result,
    });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '建立貼文失敗',
      error: err.message,
    });
  }
}

// 取得所有社群貼文
async function getAllCommunityPosts(req, res) {
  try {
    const allPosts = await db
      .select({
        postId: posts.id,
        content: posts.content,
        coverURL: posts.coverURL,
        createdAt: posts.createdAt,
        scheduleTitle: schedules.title,
        authorName: users.name,
        authorAvatar: users.avatar,
      })
      .from(posts)
      .leftJoin(schedules, eq(posts.scheduleId, schedules.id))
      .leftJoin(users, eq(posts.memberId, users.id))
      .orderBy(posts.createdAt);

    return res.json({ posts: allPosts });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: '取得貼文失敗',
      error: err.message,
    });
  }
}

// 更新社群貼文
async function updateCommunityPost(req, res) {
  try {
    const postId = Number(req.params.id);
    const { content, coverURL } = req.body;

    const [existingPost] = await db.select().from(posts).where(eq(posts.id, postId));
    if (!existingPost) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: '找不到貼文',
      });
    }

    const finalCoverURL = req.file?.location || coverURL || existingPost.coverURL;

    await db
      .update(posts)
      .set({
        content,
        coverURL: finalCoverURL,
      })
      .where(eq(posts.id, postId));

    return res.json({
      success: true,
      message: '貼文已更新',
    });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '更新失敗',
      error: err.message,
    });
  }
}

// 刪除社群貼文
async function deleteCommunityPost(req, res) {
  try {
    const memberId = req.user.id;
    const postId = Number(req.params.id);

    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.memberId, memberId)));

    return res.json({
      success: true,
      message: '社群貼文已刪除',
      result,
    });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '刪除貼文失敗',
      error: err.message,
    });
  }
}

module.exports = {
  createCommunityPost,
  getAllCommunityPosts,
  updateCommunityPost,
  deleteCommunityPost,
};
