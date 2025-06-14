const express = require('express');
const router = express.Router();
const googleAuth = require('../controllers/googleLogin');

router.post('/auth/google', googleAuth.handleGoogleLogin);

module.exports = router;