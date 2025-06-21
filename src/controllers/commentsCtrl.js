const { db } = require("../config/db");
const { comments } = require("../models/commentsSchema");
const { users } = require("../models/signUpSchema");
const { posts } = require("../models/post");
const { eq, desc } = require("drizzle-orm");

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const parsedPostId = parseInt(postId);

    if (isNaN(parsedPostId)) {
      return res.status(400).json({ error: "無效的貼文 ID" });
    }

    // console.log(`取得社群貼文 ${parsedPostId} 的留言`);

    // 先用簡單查詢測試
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

    // 為每則留言加入預設使用者資訊
    const commentsWithDefaults = postComments.map((comment) => ({
      ...comment,
    }));

    res.json(commentsWithDefaults);
  } catch (error) {
    console.error("取得留言失敗:", error);
    console.error("錯誤堆疊:", error.stack);
    res.status(500).json({ error: "取得留言失敗" });
  }
};

// 新增留言
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, memberId } = req.body;

    const parsedPostId = parseInt(postId);

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "留言內容不能為空" });
    }

    // 新增留言
    const [newComment] = await db
      .insert(comments)
      .values({
        content: content.trim(),
        memberId: memberId,
        postId: parsedPostId,
        createdAt: new Date(),
      })
      .returning();

    // 立刻查詢這則留言的會員資訊
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

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error("新增留言失敗:", error);
    res.status(500).json({ error: "新增留言失敗" });
  }
};

//刪除留言;
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    // 僅允許已登入會員操作，沒有 req.user 直接拒絕
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "未授權，請先登入" });
    }
    const currentMemberId = req.user.id;

    const [existingComment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, parseInt(commentId)))
      .limit(1);

    if (!existingComment) {
      return res.status(404).json({ error: "留言不存在" });
    }

    if (existingComment.memberId !== currentMemberId) {
      return res.status(403).json({ error: "無權限刪除此留言" });
    }

    await db.delete(comments).where(eq(comments.id, parseInt(commentId)));
    res.json({ message: "留言已刪除" });
  } catch (error) {
    console.error("刪除留言失敗:", error);
    res.status(500).json({ error: "刪除留言失敗" });
  }
};

module.exports = {
  addComment,
  deleteComment,
  getCommentsByPost,
};
