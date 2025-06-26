const { db } = require('../config/db');
const { schedules } = require('../models/scheduleSchema');
const { eq, and } = require('drizzle-orm');
const { users } = require('../models/usersSchema');
const HTTP = require('../constants/httpStatus');

const createSchedule = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HTTP.FORBIDDEN).json({ message: 'JWT無效或未登入' });
    }

    const user = await db.select().from(users).where(eq(users.id, userId));
    const isPremium = user[0]?.isPremium;

    const scheduleCounts = await db.select().from(schedules).where(eq(schedules.userId, userId));

    const requiresPayment = !isPremium && scheduleCounts.length >= 1;

    if (requiresPayment) {
      return res.status(HTTP.PAYMENT_REQUIRED).json({
        message: '需升級會員或付費才能新增更多行程',
      });
    }

    const { title, startDate, endDate, description } = req.body;
    const coverURL = req.file?.location || null;

    const inserted = await db
      .insert(schedules)
      .values({
        userId: Number(userId),
        title,
        startDate,
        endDate,
        description,
        coverURL,
      })
      .returning();

    return res.status(HTTP.CREATED).json({
      message: '行程建立成功',
      schedule: inserted[0],
    });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: '行程建立失敗',
      error: err.message,
    });
  }
};

const deleteSchedule = async (req, res) => {
  const userId = req.user.id;
  const scheduleId = Number(req.params.id);

  try {
    const deleted = await db
      .delete(schedules)
      .where(and(eq(schedules.id, scheduleId), eq(schedules.userId, userId)))
      .returning();

    if (!deleted || deleted.length === 0) {
      return res.status(HTTP.NOT_FOUND).json({ message: '找不到該行程' });
    }

    return res.json({ message: '刪除成功' });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: '刪除失敗',
      error: err.message,
    });
  }
};

module.exports = { createSchedule, deleteSchedule };