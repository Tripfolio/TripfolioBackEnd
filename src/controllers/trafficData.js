// controllers/itineraryLogic.js
const { trafficData } = require('../models/schema');
const { db } = require('../config/db');
const { eq, and } = require('drizzle-orm');
const axios = require('axios');

// 查詢資料庫中是否已經有這段路徑的交通資料
async function getTrafficData(fromPlaceId, toPlaceId, transportMode) {
  const result = await db.select().from(trafficData).where(
    and(
      eq(trafficData.fromPlaceId, fromPlaceId),
      eq(trafficData.toPlaceId, toPlaceId),
      eq(trafficData.transportMode, transportMode)
    )
  );
  return result[0];
}

// 使用 Google Maps Directions API 拿時間
async function fetchTravelTime(fromAddress, toAddress, mode) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromAddress}&destination=${toAddress}&mode=${mode}&key=${apiKey}`;
  const response = await axios.get(url);
  const route = response.data.routes?.[0]?.legs?.[0];
  if (!route) throw new Error('Google API 回傳錯誤');
  return {
    duration: route.duration.value,
    distance: route.distance.value,
  };
}

// 新增交通資料
async function insertTrafficData({ itineraryId, fromPlaceId, toPlaceId, mode, duration, distance }) {
  await db.insert(trafficData).values({
    itineraryId,
    fromPlaceId,
    toPlaceId,
    transportMode: mode,
    duration,
    distance,
  });
}

// 加入新景點時 處理交通時間
async function handleNewPlaceAdded(itineraryId, newPlaceId, prevPlaceId, fromAddress, toAddress) {
  const modes = ['walking', 'driving', 'bicycling'];

  for (const mode of modes) {
    const exists = await getTrafficData(prevPlaceId, newPlaceId, mode);
    if (!exists) {
      const travel = await fetchTravelTime(fromAddress, toAddress, mode);
      await insertTrafficData({
        itineraryId,
        fromPlaceId: prevPlaceId,
        toPlaceId: newPlaceId,
        mode,
        duration: travel.duration,
        distance: travel.distance,
      });
    }
  }
}

// 重新排序景點時 重建交通資料
async function updateTrafficAfterReorder(itineraryId, orderedPlaces) {
  await db.delete(trafficData).where(eq(trafficData.itineraryId, itineraryId));
  for (let i = 0; i < orderedPlaces.length - 1; i++) {
    const from = orderedPlaces[i];
    const to = orderedPlaces[i + 1];
    await handleNewPlaceAdded(itineraryId, to.id, from.id, from.address, to.address);
  }
}

module.exports = {
  getTrafficData,
  insertTrafficData,
  fetchTravelTime,
  handleNewPlaceAdded,
  updateTrafficAfterReorder,
};
