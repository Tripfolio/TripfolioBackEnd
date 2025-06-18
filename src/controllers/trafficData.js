const { db } = require("../config/db");
const { trafficData } = require('../models/trafficData');
const { eq , and } = require('drizzle-orm');

// 新增一筆交通資料
async function addTrafficData(req, res) {
  try {
    const { itineraryId, fromPlaceId, toPlaceId, transportMode, duration, distance } = req.body;
    const [result] = await db.insert(trafficData).values({
      itineraryId,
      fromPlaceId,
      toPlaceId,
      transportMode,
      duration,
      distance,
    }).returning();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 查詢某行程下所有交通資料
async function getTrafficData(req, res) {
  try {
    const { itineraryId } = req.query;

    if (!itineraryId || isNaN(Number(itineraryId))) {
      return res.status(400).json({ success: false, message: "缺少或無效的 itineraryId" });
    }

    const result = await db
      .select()
      .from(trafficData)
      .where(eq(trafficData.itineraryId, Number(itineraryId)));  

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("getTrafficData error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// 刪除交通資料
async function deleteTrafficData(req, res) {
  try {
    const { itineraryId, fromPlaceId, toPlaceId } = req.query;

    if (!itineraryId || !fromPlaceId || !toPlaceId) {
      return res.status(400).json({ error: "缺少必要參數" });
    }

    await db.delete(trafficData).where(
      and(
        eq(trafficData.itineraryId, Number(itineraryId)),
        eq(trafficData.fromPlaceId, Number(fromPlaceId)),
        eq(trafficData.toPlaceId, Number(toPlaceId))
      )
    );

    res.json({ success: true });
  } catch (err) {
    console.error('刪除交通資料錯誤：', err)
    res.status(500).json({ error: err.message });
  }
}



module.exports = {
  addTrafficData,
  getTrafficData,
  deleteTrafficData,
};