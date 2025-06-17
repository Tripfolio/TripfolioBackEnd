const { db } = require("../config/db");
const { trafficData } = require('../models/trafficData');
const { eq } = require('drizzle-orm');

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


// 更新交通資料
async function updateTrafficData(req, res) {
  try {
    const { id } = req.query;
    const { transportMode, duration, distance } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: '缺少或無效的 id' });
    }

    const [result] = await db
      .update(trafficData)
      .set({ transportMode, duration, distance })
      .where(eq(trafficData.id, Number(id))) 
      .returning();

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('updateTrafficData error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}


// 刪除交通資料
async function deleteTrafficData(req, res) {
  try {
    const { id } = req.query;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: "缺少或無效的 id" });
    }

    await db.delete(trafficData).where(eq(trafficData.id, Number(id)));
    res.status(204).send();
  } catch (err) {
    console.error("deleteTrafficData error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}


module.exports = {
  addTrafficData,
  getTrafficData,
  updateTrafficData,
  deleteTrafficData,
};