const { eq, desc } = require("drizzle-orm");
const { db } = require("../config/db");
const { travelSchedules } = require("../models/scheduleSchema")

//抓取會員資料庫行程
const getSchedules = async (req, res) => {
  try {
    const userId = req.user.id;
    const schedules = await db
      .select({
        id: travelSchedules.id,
        userId: travelSchedules.userId,
        title: travelSchedules.title,
        startDate: travelSchedules.startDate,
        endDate: travelSchedules.endDate,
        description: travelSchedules.description,
        coverURL: travelSchedules.coverURL,
        createdAt: travelSchedules.createdAt,
      })
      .from(travelSchedules)
      .where(eq(travelSchedules.userId, userId))
      .orderBy(desc(travelSchedules.createdAt));

    res.json({ schedules });
  } catch (err) {
    res.status(500).json({ message: "取得行程失敗", error: err.message });
  }
};
module.exports = { getSchedules };
