const express = require('express');
const router = express.Router();
const { generateClientToken, confirmPayment } = require('../controllers/paymentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get("/client_token", authenticateToken, generateClientToken);
router.post('/confirm', authenticateToken, confirmPayment);

module.exports = router;