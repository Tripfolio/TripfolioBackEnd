const { db } = require("../config/db");
const { emailPreferences } = require("../models/emailPreferences");
const { eq } = require("drizzle-orm");

async function getPreferences(req, res) {
  const userId = req.user.id;
  try {
    const result = await db
      .select({
        onLogin: emailPreferences.onLogin,
        onLoginfail: emailPreferences.onLoginfail,
        onComment: emailPreferences.onComment,
        onBookmark: emailPreferences.onBookmark,
      })
      .from(emailPreferences)
      .where(eq(emailPreferences.userId, userId));
    if (result.length === 0) {
      return res.status(404).json({ message: "找不到偏好設定" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
}

async function updatePreferences(req, res) {
  const userId = req.user.id;
  const prefs = req.body.preferences;
  try {
    await db
      .update(emailPreferences)
      .set({
        onLogin: prefs.onLogin,
        onLoginfail: prefs.onLoginfail,
        onComment: prefs.onComment,
        onBookmark: prefs.onBookmark,
      })
      .where(eq(emailPreferences.userId, userId));
    res.json({ message: "偏好設定已更新" });
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
}

module.exports = {
  getPreferences,
  updatePreferences,
};
