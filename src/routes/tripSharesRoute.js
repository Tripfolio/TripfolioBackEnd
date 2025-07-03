const express = require('express');
const router = express.Router();
const {
  createShareLink,
  getSharedUsers,
  updateUserPermission,
  removeSharedUser,
  handleShareToken,
  getMyTripsAndShared,
  getTripPermission,
} = require('../controllers/tripSharesCtrl');
const { authenticateToken } = require('../middlewares/authMiddleware'); // JWT 驗證

// 建立分享連結（需登入）
router.post('/create/:tripId', authenticateToken, createShareLink);
router.get('/list/:tripId', authenticateToken, getSharedUsers);
router.patch('/permission', authenticateToken, updateUserPermission);
router.delete('/remove/:userId/:tripId', authenticateToken, removeSharedUser);
router.get('/check/:token', authenticateToken, handleShareToken);
router.get('/allTrips', authenticateToken, getMyTripsAndShared);
router.get('/getPermission/:id', authenticateToken, getTripPermission);

module.exports = router;
