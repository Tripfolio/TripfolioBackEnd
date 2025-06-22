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
    placeOrder,
    lat,   
    lng,
  } = req.body;
  
  if (!itineraryId || typeof name !== "string" || !name.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "缺少必要參數或參數錯誤" });
  }

  try {
    const inserted = await db.insert(itineraryPlaces).values({
      itineraryId,
      name,
      address,
      photo,
      arrivalHour,
      arrivalMinute,
      placeOrder,
      lat,   
      lng,
    }).returning({ id: itineraryPlaces.id });
    res.json({ success: true, placeId: inserted[0].id });
  } catch (err) {
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
}

async function deletePlace(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
    await db
      .delete(itineraryPlaces)
      .where(eq(itineraryPlaces.id, Number(id)));

    res.json({ success: true });
  } catch (error) {
    console.error("刪除景點錯誤：", error);
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
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
};

async function updateOrder(req, res) {
  const { places } = req.body;

  try {
    for (const place of places) {
      await db
        .update(itineraryPlaces)
        .set({ placeOrder: place.placeOrder }) // JS 層用駝峰式
        .where(eq(itineraryPlaces.id, place.id));
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "更新順序失敗" });
  }
}
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
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
}
module.exports = {
  addPlace,
  deletePlace,
  getPlaces,
  updateOrder,
  updateArriveTime,
};
