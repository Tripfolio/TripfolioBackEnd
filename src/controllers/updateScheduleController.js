const { db } = require("../config/db");
const { travelSchedules } = require("../models/scheduleSchema");
const { eq } = require("drizzle-orm");
const s3 = require("../config/s3");

const updateSchedule = async (req, res) => {
  const memberId = req.user?.id;
  const scheduleId = Number(req.params.id);

  if (!memberId) {
    return res.status(403).json({ message: "JWT無效或未登入" });
  }

  try {
    const { title, startDate, endDate, description } = req.body;

    const existingSchedules = await db
      .select()
      .from(travelSchedules)
      .where(eq(travelSchedules.id, scheduleId))
      .limit(1);

    if (!existingSchedules || existingSchedules.length === 0) {
      return res.status(404).json({ message: "找不到行程" });
    }

    const existingSchedule = existingSchedules[0];
    let finalCoverURL = existingSchedule.coverURL;

    if (req.file) {
      finalCoverURL = req.file.location;

      if (existingSchedule.coverURL) {
        if (
          existingSchedule.coverURL.includes("s3.amazonaws.com") ||
          existingSchedule.coverURL.includes(process.env.AWS_COVER_S3_BUCKET)
        ) {
          const url = new URL(existingSchedule.coverURL);
          const oldKey = url.pathname.substring(1);

          const params = {
            Bucket: process.env.AWS_COVER_S3_BUCKET,
            Key: oldKey,
          };
          try {
            await s3.deleteObject(params).promise();
          } catch (s3Err) {
            console.warn(`刪除舊封面圖片 ${oldKey} 失敗：`, s3Err.message);
          }
        }
      }
    }

    const updateData = {
      ...(title !== undefined && { title }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(description !== undefined && { description }),
      coverURL: finalCoverURL,
      updatedAt: new Date().toISOString(),
    };

    const [updatedSchedule] = await db
      .update(travelSchedules)
      .set(updateData)
      .where(eq(travelSchedules.id, scheduleId))
      .returning();

    if (!updatedSchedule) {
      return res.status(404).json({ message: "更新失敗，找不到行程" });
    }

    res.json({
      message: "行程更新成功",
      updatedSchedule: updatedSchedule,
    });
  } catch (err) {
    res.status(500).json({
      message: "更新行程失敗",
      error: err.message,
    });
  }
};

const addDayToSchedule = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(403).json({ message: "JWT無效或未登入" });
  }

  try {
    const existingSchedules = await db
      .select()
      .from(travelSchedules)
      .where(eq(travelSchedules.id, Number(id)))
      .limit(1);

    if (!existingSchedules || existingSchedules.length === 0) {
      return res.status(404).json({ message: "行程未找到或無權限操作" });
    }

    const existingSchedule = existingSchedules[0];

    let currentEndDate = existingSchedule.endDate
      ? new Date(existingSchedule.endDate)
      : new Date();
    currentEndDate.setDate(currentEndDate.getDate() + 1);

    const newEndDateString = currentEndDate.toISOString().split("T")[0];

    const [updatedSchedule] = await db
      .update(travelSchedules)
      .set({
        endDate: newEndDateString,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(travelSchedules.id, Number(id)))
      .returning();

    if (!updatedSchedule) {
      return res.status(500).json({ message: "更新行程失敗" });
    }

    res.status(200).json({
      id: updatedSchedule.id,
      title: updatedSchedule.title,
      startDate: updatedSchedule.startDate,
      endDate: updatedSchedule.endDate,
      coverURL: updatedSchedule.coverURL,
      description: updatedSchedule.description,
    });
  } catch (error) {
    res.status(500).json({ message: "伺服器內部錯誤", error: error.message });
  }
};

const getTravelScheduleById = async (req, res) => {
  const { id } = req.params;
  const memberId = req.user?.id;

  if (!memberId) {
    return res.status(403).json({ message: "JWT無效或未登入" });
  }

  try {
    const schedule = await db
      .select()
      .from(travelSchedules)
      .where(eq(travelSchedules.id, Number(id)))
      .where(eq(travelSchedules.userId, memberId))
      .limit(1);

    if (!schedule || schedule.length === 0) {
      return res.status(404).json({ message: "找不到行程或無權限" });
    }

    res.json(schedule[0]);
  } catch (error) {
    res.status(500).json({ message: "獲取單一行程失敗", error: error.message });
  }
};

module.exports = { updateSchedule, addDayToSchedule, getTravelScheduleById };
