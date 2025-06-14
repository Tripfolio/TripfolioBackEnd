const { db } = require('../config/db');
const { communityPosts } = require('../models/post');

async function createCommunityPost(req, res) {
  try {
    const memberId = req.user.id;
    const { scheduleId, content } = req.body;
    const coverURL = req.file?.location || null;

    const result = await db.insert(communityPosts).values({
      memberId,
      scheduleId,
      content,
      coverURL,
    });

    res.status(201).json({ success: true, message: '社群貼文已建立', result });
  } catch (err) {
    res.status(500).json({ success: false, message: '建立貼文失敗', error: err.message });
  }
}

module.exports = { createCommunityPost };