const { db } = require('../config/db');
const { communityPosts } = require('../models/post');
const { travelSchedules } = require('../models/scheduleSchema');
const { eq, and } = require('drizzle-orm');

async function createCommunityPost(req, res) {
  try {
    const memberId = req.user.id;
    const { scheduleId, content } = req.body;
    const coverURL = req.file?.location || req.body.coverURL || null;

    const result = await db.insert(communityPosts).values({
      memberId,
      scheduleId: Number(scheduleId),
      content,
      coverURL,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: '社群貼文已建立', result });
  } catch (err) {
    res.status(500).json({ success: false, message: '建立貼文失敗', error: err.message });
  }
}

async function getAllCommunityPosts(req, res) {
  try {
    const posts = await db
      .select({
        postId: communityPosts.id,
        content: communityPosts.content,
        coverURL: communityPosts.coverURL,
        createdAt: communityPosts.createdAt,
        scheduleTitle: travelSchedules.title,
      })
      .from(communityPosts)
      .leftJoin(travelSchedules, eq(communityPosts.scheduleId, travelSchedules.id)).orderBy(communityPosts.createdAt);
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: '取得貼文失敗', error: err.message });
  }
}

async function updateCommunityPost(req, res) {
  try {
    const postId = Number(req.params.id);
    const { content, coverURL } = req.body;
    const [existingPost] = await db.select().from(communityPosts).where(eq(communityPosts.id, postId));
    if (!existingPost) {
      return res.status(404).json({ success: false, message: '找不到貼文' });
    }

    let finalCoverURL = existingPost.coverURL;

    if (req.file) {
      finalCoverURL = req.file.location || `/uploads/${req.file.filename}`;
    } else if (coverURL) {
      finalCoverURL = coverURL;
    }

    await db
      .update(communityPosts)
      .set({
        content,
        coverURL: finalCoverURL,
      })
      .where(eq(communityPosts.id, postId));

    res.json({ success: true, message: '貼文已更新' });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失敗', error: err.message });
  }
}

async function deleteCommunityPost(req, res) {
  try {
    const memberId = req.user.id;
    const postId = Number(req.params.id);

    const result = await db
      .delete(communityPosts)
      .where(and(eq(communityPosts.id, postId), eq(communityPosts.memberId, memberId)));

    res.json({ success: true, message: '社群貼文已刪除', result });
  } catch (err) {
    res.status(500).json({ success: false, message: '刪除貼文失敗', error: err.message });
  }
}

module.exports = {
  createCommunityPost,
  getAllCommunityPosts,
  updateCommunityPost,
  deleteCommunityPost,
};
