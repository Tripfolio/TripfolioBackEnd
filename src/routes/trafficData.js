
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trafficRoutesCtrl');

router.post('/add-traffic', ctrl.addTraffic);
router.post('/reorder-traffic', ctrl.reorderTraffic);

module.exports = router;
