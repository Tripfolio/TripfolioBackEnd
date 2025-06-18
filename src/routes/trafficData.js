const express = require('express');
const router = express.Router();
const {
  addTrafficData,
  getTrafficData,
  deleteTrafficData,
} = require('../controllers/trafficData');

router.post('/add-traffic', addTrafficData);

router.get('/get-all-traffic', getTrafficData);

router.delete('/delete-traffic', deleteTrafficData);

module.exports = router;
