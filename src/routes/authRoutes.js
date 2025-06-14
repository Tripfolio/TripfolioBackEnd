const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleLogin = require('../controllers/googleLogin');

router.post('/signup', authController.registerUser);
router.post('/auth/google-login', googleLogin.handleGoogleLogin);

module.exports = router;

