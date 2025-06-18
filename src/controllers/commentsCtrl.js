const { db } = require("../config/db");
const { comments } = require("../models/commentsSchema");
const { members } = require("../models/schema");
const { posts } = require("../models/post");
const { eq, desc } = require("drizzle-orm");

// 取得特定貼文的所有留言（簡化版）
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
        // 暫時註解掉 join，先確保基本查詢正常
        // userName: members.name,
        // userAvatar: members.avatar,
      })
      .from(comments)
      .where(eq(comments.postId, parsedPostId))
      .orderBy(desc(comments.createdAt));

    // console.log(`找到 ${postComments.length} 則留言`);

    // 為每則留言加入預設使用者資訊
    const commentsWithDefaults = postComments.map((comment) => ({
      ...comment,
      userName: "會員使用者", // 暫時的預設名稱
      userAvatar: "https://picsum.photos/40/40?random=1",
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

    // console.log(`新增留言到貼文 ${parsedPostId}`);

    // 直接新增留言，暫時跳過存在性檢查
    const [newComment] = await db
      .insert(comments)
      .values({
        content: content.trim(),
        memberId: memberId || 1, // 提供預設值
        postId: parsedPostId,
        createdAt: new Date(),
      })
      .returning();

    // console.log("新增留言成功:", newComment);

    // 回傳簡化的結果
    const result = {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      postId: newComment.postId,
      memberId: newComment.memberId,
      userName: "會員使用者",
      userAvatar: "https://picsum.photos/40/40?random=1",
    };

    res.status(201).json(result);
  } catch (error) {
    console.error("新增留言失敗:", error);
    res.status(500).json({ error: "新增留言失敗" });
  }
};

//刪除留言;
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
