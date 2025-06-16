const { db } = require("../config/db");
const comments = require("../models/commentsSchema");

const addComment = async (req, res) => {
  try {
    const { content, memberId } = req.body;
    const [newComment] = await db
      .insert(comments)
      .values({ content, memberId })
      .returning();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "新增留言失敗" });
  }
};

const getComment = async (req, res) => {
  try {
    const allComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        memberName: members.name,
      })
      .from(comments)
      .leftJoin(members, eq(comments.memberId, members.id))
      .orderBy(desc(comments.createdAt));
    res.json(allComments);
  } catch (error) {
    res.status(500).json({ error: "取得留言失敗" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const currentMemberId = req.user.id; // 從 JWT 或 session 取得

    const existingComment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({ error: "留言不存在" });
    }

    // 檢查是否為留言作者
    if (existingComment[0].memberId !== currentMemberId) {
      return res.status(403).json({ error: "無權限刪除此留言" });
    }

    await db.delete(comments).where(eq(comments.id, commentId));
    res.json({ message: "留言已刪除" });
  } catch (error) {
    res.status(500).json({ error: "刪除留言失敗" });
  }
};

module.exports = { addComment, getComment, deleteComment };
