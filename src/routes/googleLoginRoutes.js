const express = require('express');
const router = express.Router();
const { handleGoogleLogin } = require('../controllers/googleLogin');

router.post('/auth/google', handleGoogleLogin);

module.exports = router;