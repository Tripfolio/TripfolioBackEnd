const express = require('express');
const router = express.Router();
const { confirmPayment } = require('../controllers/paymentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/confirm', authenticateToken, confirmPayment);

module.exports = router;