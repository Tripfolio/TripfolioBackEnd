const { db } = require('../config/db');
const { emails } = require('../models/emailsSchema');
const { eq } = require('drizzle-orm');
const HTTP = require('../constants/httpStatus');
const getPreferences = async (req, res) => {
  const userId = req.user.id;

  try {
    const [preference] = await db
      .select({
        onLogin: emails.onLogin,
        onLoginfail: emails.onLoginfail,
        onComment: emails.onComment,
        onBookmark: emails.onBookmark,
      })
      .from(emails)
      .where(eq(emails.userId, userId));

    if (!preference) {
      return res.status(HTTP.NOT_FOUND).json({ message: '找不到偏好設定' });
    }

    return res.json(preference);
  } catch (err) {
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ message: '伺服器錯誤', error: err.message });
  }
};

async function updatePreferences(req, res) {
  const userId = req.user.id;
  const prefs = req.body.preferences;
  try {
    await db
      .update(emails)
      .set({
        onLogin: prefs.onLogin,
        onLoginfail: prefs.onLoginfail,
        onComment: prefs.onComment,
        onBookmark: prefs.onBookmark,
      })
      .where(eq(emails.userId, userId));
    res.json({ message: '偏好設定已更新' });
  } catch (err) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: '伺服器錯誤' });
  }
}

module.exports = {
  getPreferences,
  updatePreferences,
};
