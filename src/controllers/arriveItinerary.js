const { db } = require('../config/db.js');
const { eq } = require('drizzle-orm');
const { schedulePlaces } = require('../models/schedulePlacesSchema');
const HTTP = require('../constants/httpStatus');

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

    return res.status(HTTP.OK).json({ success: true });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ success: false, message: '伺服器錯誤' });
  }
}
module.exports = { updateArriveTime };
