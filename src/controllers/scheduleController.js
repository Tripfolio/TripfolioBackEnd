const { db } = require("../config/db");
const { travelSchedules } = require("../models/scheduleSchema");
const { eq, and } = require("drizzle-orm");
const { users } = require("../models/signUpSchema");

const createSchedule = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: "JWT無效或未登入" });
    }

    const user = await db.select().from(users).where(eq(users.id, userId));
    const isPremium = user[0]?.isPremium;

    const scheduleCounts = await db
      .select()
      .from(travelSchedules)
      .where(eq(travelSchedules.userId, userId));

    const requiresPayment = !isPremium && scheduleCounts.length >= 1;

    if (requiresPayment) {
      return res.status(402).json({
        message: "需升級會員或付費才能新增更多行程",
      });
    }

    const { title, startDate, endDate, description } = req.body;
    const coverURL = req.file?.location || null;

    const inserted = await db
      .insert(travelSchedules)
      .values({
        userId: Number(userId),
        title,
        startDate,
        endDate,
        description,
        coverURL,
      })
      .returning();

    res.status(201).json({
      message: "行程建立成功",
      schedule: inserted[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "行程建立失敗",
      error: err.message,
    });
  }
};

const deleteSchedule = async (req, res) => {
  const userId = req.user.id;
  const scheduleId = Number(req.params.id);

  try {
    const deleted = await db
      .delete(travelSchedules)
      .where(
        and(
          eq(travelSchedules.id, scheduleId),
          eq(travelSchedules.userId, userId),
        ),
      )
      .returning();

    if (deleted === 0) {
      return res.status(404).json({ message: "找不到該行程" });
    }
    res.json({ message: "刪除成功" });
  } catch (err) {
    res.status(500).json({ message: "刪除失敗", error: err.message });
  }
};

module.exports = { createSchedule, deleteSchedule };
