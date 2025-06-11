const { db } = require("../config/db");
const { travelSchedules } = require("../models/scheduleSchema");
const { eq } = require("drizzle-orm");

//建立行程
const createSchedule = async (req, res) => {
    try {
        const memberId = req.user?.id;

        if(!memberId) {
            return res.status(403).json({ message: "JWT無效或未登入" });
        }

        //拿表單欄位
        const{ title, startDate, endDate, description } = req.body;

        //拿圖片網址
        const coverURL = req.file?.location || null;

        //存入資料庫
        const inserted = await db
        .insert(travelSchedules)
        .values({
            memberId: Number(memberId),
            title,
            startDate,
            endDate,
            description,
            coverURL: coverURL
        })
        .returning();
    
    res.status(201).json({
        message: "行程建立成功",
        schedule: inserted[0],
    });

    } catch (err){
        console.error("建立行程失敗", err);
        res.status(500).json({
            message: "行程建立失敗",
            error: err.message,
        });
    } 
};


//刪除行程
const deleteSchedule = async (req, res) => {
    const memberId = req.user.id;
    const scheduleId = Number(req.params.id);

    try {
        const deleted = await db.delete(travelSchedules)
        .where(eq(travelSchedules.id, scheduleId));

        res.json({ message: "刪除成功"});
    } catch (err) {
        console.error('刪除失敗', err);
        res.status(500).json({ message:"刪除失敗", error: err.message});
    }
};



module.exports = { createSchedule, deleteSchedule };