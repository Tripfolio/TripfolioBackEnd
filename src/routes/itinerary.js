// routes/itinerary.js
const express = require('express')
const router = express.Router()
const { db } = require('../db/index')
const { itineraryPlaces } = require('../db/schema') 

router.post('/add-place', async (req, res) => {
  const { itineraryId, name, address } = req.body
  if (!itineraryId || !name) {
    return res.status(400).json({ success: false, message: '缺少資料' })
  }
  try {
    await db.insert(itineraryPlaces).values({
      itineraryId,
      name,
      address
    })
    res.json({ success: true })
  } catch (err) {
    console.error('資料庫寫入錯誤:', err)
    res.status(500).json({ success: false, message: '伺服器錯誤' })
  }
})

module.exports = router
