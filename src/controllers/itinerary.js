const { db } = require('../config/db');
const { schedulePlaces } = require('../models/schedulePlacesSchema');
const { and, eq } = require('drizzle-orm');
const HTTP = require('../constants/httpStatus');

async function addPlace(req, res) {
  const { itineraryId, name, address, photo, arrivalHour, arrivalMinute, placeOrder, date } =
    req.body;

  if (!itineraryId || typeof name !== 'string' || !name.trim() || !date) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: '缺少必要參數或參數錯誤' });
  }

  try {
    const [newPlace] = await db
      .insert(schedulePlaces)
      .values({ itineraryId, name, address, photo, arrivalHour, arrivalMinute, placeOrder, date })
      .returning();

    return res.json({ success: true, place: newPlace });
  } catch (err) {
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: '新增失敗', error: err.message });
  }
}

async function deletePlace(req, res) {
  const { itineraryId, name } = req.query;

  if (!itineraryId || !name) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: '缺少必要參數' });
  }

  try {
    await db
      .delete(schedulePlaces)
      .where(
        and(eq(schedulePlaces.itineraryId, itineraryId), eq(schedulePlaces.name, name)),
      );

    return res.json({ success: true });
  } catch (err) {
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: '刪除失敗', error: err.message });
  }
}

async function getPlaces(req, res) {
  const { itineraryId, date } = req.query;

  console.log("收到參數：", { itineraryId, date });

  if (!itineraryId) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: '缺少 itineraryId' });
  }

  try {
    const conditions = [eq(schedulePlaces.itineraryId, Number(itineraryId))];

    if (date) {
      // 保證是乾淨字串傳入，資料庫目前 text 型態這樣最穩
      conditions.push(eq(schedulePlaces.date, String(date).trim()));
    }

    console.log("查詢條件：", conditions);

    const places = await db
      .select()
      .from(schedulePlaces)
      .where(and(...conditions));

    return res.json({ success: true, places });
  } catch (err) {
    console.error("查詢失敗：", err);
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: '伺服器錯誤', error: err.message });
  }
}
 

async function updateOrder(req, res) {
  const { places } = req.body;

  try {
    for (const { id, placeOrder } of places) {
      await db.update(schedulePlaces).set({ placeOrder }).where(eq(schedulePlaces.id, id));
    }

    return res.json({ success: true });
  } catch (err) {
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: '更新順序失敗', error: err.message });
  }
}

async function updateArriveTime(req, res) {
  const placeId = Number(req.params.id);
  const { arrivalHour, arrivalMinute } = req.body;

  if (!placeId || arrivalHour === undefined || arrivalMinute === undefined) {
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: '缺少必要參數' });
  }

  try {
    await db
      .update(schedulePlaces)
      .set({ arrivalHour, arrivalMinute })
      .where(eq(schedulePlaces.id, placeId));

    return res.json({ success: true });
  } catch (err) {
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: '更新抵達時間失敗', error: err.message });
  }
}

module.exports = {
  addPlace,
  deletePlace,
  getPlaces,
  updateOrder,
  updateArriveTime,
};