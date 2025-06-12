const { db } = require("../config/db");
const { itineraryPlaces } = require("../models/itinerary");
const { and, eq } = require("drizzle-orm");

async function addPlace(req, res) {
  const {
    itineraryId,
    name,
    address,
    photo,
    arrivalHour,
    arrivalMinute,
    order,
  } = req.body;
  if (!itineraryId || typeof name !== "string" || !name.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "缺少必要參數或參數錯誤" });
  }

  try {
    await db.insert(itineraryPlaces).values({
      itineraryId,
      name,
      address,
      photo,
      arrivalHour,
      arrivalMinute,
      order,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("資料庫寫入錯誤:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
}

async function deletePlace(req, res) {
  console.log("▶️ 收到 DELETE /api/itinerary/place", req.query);
  const { itineraryId, name } = req.query;

  if (!itineraryId || !name) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
    await db
      .delete(itineraryPlaces)
      .where(
        and(
          eq(itineraryPlaces.itineraryId, Number(itineraryId)),
          eq(itineraryPlaces.name, name)
        )
      );

    res.json({ success: true });
  } catch (error) {
    console.error("刪除景點失敗：", error);
    res.status(500).json({ success: false, message: "刪除失敗" });
  }
}

async function getPlaces(req, res) {
  const { itineraryId } = req.query;

  if (!itineraryId) {
    return res
      .status(400)
      .json({ success: false, message: "缺少 itineraryId" });
  }

  try {
    const places = await db
      .select()
      .from(itineraryPlaces)
      .where(eq(itineraryPlaces.itineraryId, Number(itineraryId)));

    res.json({ success: true, places });
  } catch (err) {
    console.error("查詢景點失敗:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
}

async function updatePlace(req, res) {
  const placeId = Number(req.params.id);
  // const { arrivalHour, arrivalMinute } = req.body;
  console.log(req.body);

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
    console.error("❌ 更新時間失敗:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
}

async function updateOrder(req, res) {
  console.log("收到請求");
  console.log("req.body", req.body);

  // try {
  //   for (const place of places) {
  //     await db.query(`UPDATE itinerary_places SET "order" = $1 WHERE id = $2`, [
  //       place.order,
  //       place.id,
  //     ]);
  //   }

  //   res.json({ success: true });
  // } catch (err) {
  //   console.error("更新順序失敗", err);
  //   res.status(500).json({ success: false, message: "更新順序失敗" });
  // }
}

module.exports = { addPlace, deletePlace, getPlaces, updatePlace, updateOrder };
