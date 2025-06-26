const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/emailPreferencesCtrl');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/get', authenticateToken, getPreferences);
router.put('/update', authenticateToken, updatePreferences);

module.exports = router;
