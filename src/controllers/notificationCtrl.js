const { db } = require("../config/db");
const { sendEmail } = require("../utils/emailSender");
const { emailPreferences } = require("../models/emailPreferences");
const { users } = require("../models/signUpSchema");
const { eq } = require("drizzle-orm");

// 取得使用者 Email
async function getUserEmail(userId) {
  try {
    const result = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId));
    return result[0]?.email || null;
  } catch (err) {
    return null;
  }
}

// 共用偏好檢查邏輯
async function isPreferenceEnabled(userId, field) {
  try {
    const pref = await db
      .select()
      .from(emailPreferences)
      .where(eq(emailPreferences.userId, userId));
    return !!pref[0]?.[field];
  } catch (err) {
    return false;
  }
}

// 各類通知函式

async function notifyRegister(userId) {
  try {
    if (!(await isPreferenceEnabled(userId, "onRegister"))) return;
    const email = await getUserEmail(userId);
    if (!email) return;
    await sendEmail(email, "註冊成功通知", `<p>歡迎加入 Tripfolio！</p>`);
  } catch (err) {
    return { success: false, error: "郵件發送失敗，請稍後再試。" };
  }
}

async function notifyLogin(userId) {
  try {
    if (!(await isPreferenceEnabled(userId, "onLogin"))) return;
    const email = await getUserEmail(userId);
    if (!email) return;
    await sendEmail(email, "登入成功通知", `<p>您已成功登入 Tripfolio！</p>`);
  } catch (err) {
    return { success: false, error: "郵件發送失敗，請稍後再試。" };
  }
}

async function notifyLoginfail(userId) {
  try {
    if (!(await isPreferenceEnabled(userId, "onLoginfail"))) return;
    const email = await getUserEmail(userId);
    if (!email) return;
    await sendEmail(
      email,
      "登入失敗警示",
      `<p>⚠️ 偵測到異常登入失敗，請確認是否為本人操作。</p>`,
    );
  } catch (err) {
    return { success: false, error: "郵件發送失敗，請稍後再試。" };
  }
}

async function notifyCommented(userId, commentContent) {
  try {
    if (!(await isPreferenceEnabled(userId, "onComment"))) return;
    const email = await getUserEmail(userId);
    if (!email) return;
    await sendEmail(
      email,
      "您的貼文有新留言",
      `<p>留言內容：${commentContent}</p>`,
    );
  } catch (err) {
    return { success: false, error: "郵件發送失敗，請稍後再試。" };
  }
}

async function notifyBookmarked(userId, bookmarkerName) {
  try {
    if (!(await isPreferenceEnabled(userId, "onBookmark"))) return;
    const email = await getUserEmail(userId);
    if (!email) return;
    await sendEmail(
      email,
      "您的貼文被收藏",
      `<p>${bookmarkerName} 收藏了您的貼文。</p>`,
    );
  } catch (err) {
    return { success: false, error: "郵件發送失敗，請稍後再試。" };
  }
}

module.exports = {
  getUserEmail,
  isPreferenceEnabled,
  notifyRegister,
  notifyLogin,
  notifyLoginfail,
  notifyCommented,
  notifyBookmarked,
};
