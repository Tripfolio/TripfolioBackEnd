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
        let coverURL = req.file?.location || null;

        const existingSchedule = await db
            .select()
            .from(travelSchedules)
            .where(eq(travelSchedules.id, scheduleId))
            .limit(1);

        if (!existingSchedule || existingSchedule.length === 0) {
            return res.status(404).json({ message: "找不到行程" });
        }

        const oldCoverURL = existingSchedule[0].coverURL;

        if (req.file && oldCoverURL) {
            const oldKey = oldCoverURL.split('/').pop();
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: oldKey,
            };
            await s3.deleteObject(params).promise();
            console.log(`舊封面圖片 ${oldKey} 已從 S3 刪除。`);
        } else if (coverURL === null && req.file === undefined) {
            coverURL = oldCoverURL;
        }

        const updateData = {
            title,
            startDate,
            endDate,
            description,
            coverURL: coverURL,
        };

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        await db
            .update(travelSchedules)
            .set(updateData)
            .where(eq(travelSchedules.id, scheduleId));

        const [updatedSchedule] = await db
            .select()
            .from(travelSchedules)
            .where(eq(travelSchedules.id, scheduleId))
            .limit(1);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "更新失敗，找不到行程" });
        }

        res.json({
            message: "行程更新成功",
            updatedSchedule: updatedSchedule,
        });

    } catch (err) {
        console.error("更新行程失敗", err);
        res.status(500).json({
            message: "更新行程失敗",
            error: err.message,
        });
    }
};

module.exports = { updateSchedule };