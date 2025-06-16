const { db } = require("../config/db");
const { trafficData } = require('../models/trafficData');

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
    const { itineraryId } = req.params;
    const result = await db.select().from(trafficData).where({ itineraryId: Number(itineraryId) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 更新交通資料
async function updateTrafficData(req, res) {
  try {
    const { id } = req.params;
    const { transportMode, duration, distance } = req.body;
    const [result] = await db.update(trafficData)
      .set({ transportMode, duration, distance })
      .where({ id: Number(id) })
      .returning();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 刪除交通資料
async function deleteTrafficData(req, res) {
  try {
    const { id } = req.params;
    await db.delete(trafficData).where({ id: Number(id) });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  addTrafficData,
  getTrafficData,
  updateTrafficData,
  deleteTrafficData,
};