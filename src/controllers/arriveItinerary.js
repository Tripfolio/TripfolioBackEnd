const { db } = require("../config/db.js");
const { eq } = require("drizzle-orm");
const { itineraryPlaces } = require("../models/itinerary"); // ← 修正這一行

async function updateArriveTime(req, res) {
  const placeId = Number(req.params.id);
  const { arrivalHour, arrivalMinute } = req.body;

  if (!placeId || arrivalHour === undefined || arrivalMinute === undefined) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
    await db
      .update(itineraryPlaces)
      .set({ arrivalHour, arrivalMinute })
      .where(eq(itineraryPlaces.id, placeId));

    res.json({ success: true });
  } catch (err) {
    console.error("❌ 更新時間失敗:", err.stack);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
}
module.exports = { updateArriveTime };
