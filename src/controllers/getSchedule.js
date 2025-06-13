const{ eq, desc } = require("drizzle-orm");
const{ dbSchedule } = require("../config/db");
const{ travelSchedules } = require("../models/scheduleSchema");

//抓取會員資料庫行程
const getSchedules = async (req, res) => {
    try {
        const memberId = req.user.id;
        const schedules = await dbSchedule
        .select()
        .from(travelSchedules)
        .where(eq(travelSchedules.memberId, memberId))
        .orderBy(desc(travelSchedules.createdAt));
    
    res.json({ schedules });
    } catch (err) {
        res.status(500).json({ message:"取得行程失敗", error:err.message });
    }
};

module.exports = { getSchedules };