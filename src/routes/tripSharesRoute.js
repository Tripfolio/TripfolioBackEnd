const express = require('express');
const router = express.Router();
const tripSharesCtrl = require('../controllers/tripSharesCtrl');
const { authenticateToken } = require('../middlewares/authMiddleware'); // JWT 驗證

// 建立分享連結（需登入）
router.post('/:tripId', authenticateToken, tripSharesCtrl.createShareLink);
router.get('/list/:tripId', authenticateToken, tripSharesCtrl.getSharedUsers);
router.patch('/permission', authenticateToken, tripSharesCtrl.updateUserPermission);
router.delete('/:userId/:tripId', authenticateToken, tripSharesCtrl.removeSharedUser);
router.get('/:token', authenticateToken, tripSharesCtrl.handleShareToken);
router.get('/allTrips', authenticateToken, tripSharesCtrl.getMyTripsAndShared);
router.get('/:id/permission', authenticateToken, tripSharesCtrl.getTripPermission);

module.exports = router;
