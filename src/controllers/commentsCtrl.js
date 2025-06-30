const { db } = require('../config/db');
const { comments } = require('../models/commentsSchema');
const { users } = require('../models/usersSchema');
const { eq, desc } = require('drizzle-orm');
const HTTP = require('../constants/httpStatus');

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const parsedPostId = parseInt(postId, 10);

    if (isNaN(parsedPostId)) {
      return res.status(HTTP.BAD_REQUEST).json({ error: '無效的貼文 ID' });
    }

    const postComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        postId: comments.postId,
        memberId: comments.memberId,
        userName: users.name,
        userAvatar: users.avatar,
      })
      .from(comments)
      .leftJoin(users, eq(comments.memberId, users.id))
      .where(eq(comments.postId, parsedPostId))
      .orderBy(desc(comments.createdAt));

    res.json(postComments);
  } catch (error) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: '取得留言失敗' });
  }
  return null;
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, memberId } = req.body;
    const parsedPostId = parseInt(postId, 10);

    if (!content || !content.trim()) {
      return res.status(HTTP.BAD_REQUEST).json({ error: '留言內容不能為空' });
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        content: content.trim(),
        memberId,
        postId: parsedPostId,
        createdAt: new Date(),
      })
      .returning();

    const [commentWithUser] = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        postId: comments.postId,
        memberId: comments.memberId,
        userName: users.name,
        userAvatar: users.avatar,
      })
      .from(comments)
      .leftJoin(users, eq(comments.memberId, users.id))
      .where(eq(comments.id, newComment.id));

    return res.status(HTTP.CREATED).json(commentWithUser);
  } catch (error) {

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: '新增留言失敗' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!req.user || !req.user.id) {
      return res.status(HTTP.UNAUTHORIZED).json({ error: '未授權，請先登入' });
    }
    const currentMemberId = req.user.id;

    const [existingComment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, parseInt(commentId, 10)))
      .limit(1);

    if (!existingComment) {
      return res.status(HTTP.NOT_FOUND).json({ error: '留言不存在' });
    }

    if (existingComment.memberId !== currentMemberId) {
      return res.status(HTTP.FORBIDDEN).json({ error: '無權限刪除此留言' });
    }

    await db.delete(comments).where(eq(comments.id, parseInt(commentId, 10)));
    return res.json({ message: '留言已刪除' });
  } catch (error) {

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: '刪除留言失敗' });
  }
};

module.exports = {
  addComment,
  deleteComment,
  getCommentsByPost,
};
