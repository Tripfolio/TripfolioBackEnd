const express = require('express');
const router = express.Router();
const {
  addTrafficData,
  getTrafficData,
  updateTrafficData,
  deleteTrafficData,
} = require('../controllers/trafficData');

router.post('/add-traffic', addTrafficData);

router.get('/get-all-traffic', getTrafficData);

router.put('/update-traffic', updateTrafficData);

router.delete('/delete-traffic', deleteTrafficData);

module.exports = router;
