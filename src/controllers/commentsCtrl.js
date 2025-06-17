const { db } = require("../config/db");
const comments = require("../models/commentsSchema");
const members = require("../models/schema");
const posts = require("../models/post");
const { eq, desc } = require("drizzle-orm");

// 取得特定貼文的所有留言（包含頭像）
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        postId: comments.postId,
        // 使用者資訊
        memberId: comments.memberId,
        userName: members.name,
        userAvatar: members.avatar, // 頭像
      })
      .from(comments)
      .leftJoin(members, eq(comments.memberId, members.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    // 為沒有頭像的使用者提供預設頭像
    const commentsWithDefaultAvatar = postComments.map((comment) => ({
      ...comment,
      userAvatar:
        comment.userAvatar || "https://via.placeholder.com/40?text=User",
    }));

    res.json(commentsWithDefaultAvatar);
  } catch (error) {
    console.error("取得留言失敗:", error);
    res.status(500).json({ error: "取得留言失敗" });
  }
};

// 新增留言
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, memberId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "留言內容不能為空" });
    }

    // 檢查貼文是否存在
    const postExists = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, parseInt(postId)))
      .limit(1);

    if (!postExists.length) {
      return res.status(404).json({ error: "貼文不存在" });
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        content: content.trim(),
        memberId,
        postId: parseInt(postId),
        createdAt: new Date(),
      })
      .returning();

    // 取得完整的留言資訊（包含使用者頭像）
    const commentWithUser = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        postId: comments.postId,
        memberId: comments.memberId,
        userName: members.name,
        userAvatar: members.avatar,
      })
      .from(comments)
      .leftJoin(members, eq(comments.memberId, members.id))
      .where(eq(comments.id, newComment.id));

    // 提供預設頭像
    const result = {
      ...commentWithUser[0],
      userAvatar:
        commentWithUser[0].userAvatar ||
        "https://via.placeholder.com/40?text=User",
    };

    res.status(201).json(result);
  } catch (error) {
    console.error("新增留言失敗:", error);
    res.status(500).json({ error: "新增留言失敗" });
  }
};

// 刪除留言
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const currentMemberId = req.user?.id || 1;

    const existingComment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, parseInt(commentId)))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({ error: "留言不存在" });
    }

    if (existingComment[0].memberId !== currentMemberId) {
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
