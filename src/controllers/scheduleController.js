const { db } = require("../config/db");
const { travelSchedules } = require("../models/scheduleSchema");
const { eq, and } = require("drizzle-orm");

//建立行程
const createSchedule = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ message: "JWT無效或未登入" });
    }

    //拿表單欄位
    const { title, startDate, endDate, description } = req.body;

    //拿圖片網址
    const coverURL = req.file?.location || null;

    //存入資料庫
    const inserted = await db
      .insert(travelSchedules)
      .values({
        userId: Number(userId),
        title,
        startDate,
        endDate,
        description,
        coverURL: coverURL,
      })
      .returning();

    res.status(201).json({
      message: "行程建立成功",
      schedule: inserted[0],
    });
  } catch (err) {
    // eslint-disable-next-line no-empty
    res.status(500).json({
      message: "行程建立失敗",
      error: err.message,
    });
  }
};

//刪除行程
const deleteSchedule = async (req, res) => {
  const userId = req.user.id;
  const scheduleId = Number(req.params.id);

  try {
    const deleted = await db
      .delete(travelSchedules)
      .where(
        and(
          eq(travelSchedules.id, scheduleId),
          eq(travelSchedules.userId, userId)
        )
      )
      .returning();

    if (deleted === 0) {
      return res.status(404).json({ message: '找不到該行程'});
    }
    res.json({ message: "刪除成功" });
  } catch (err) {
    res.status(500).json({ message: "刪除失敗", error: err.message });
  }
};

//動態追蹤取得會員建立過的行程
const getSchedulesByMemberId = async(req, res) => {
  const { memberId } = req.params;

  try {
    const result = await db
      .select()
      .from(travelSchedules)
      .where(eq(travelSchedules.memberId, memberId));

      res.json(result);
  } catch (err) {
    res.status(500).json({ error: '伺服器錯誤'});
  }
};

module.exports = { createSchedule, deleteSchedule, getSchedulesByMemberId };
