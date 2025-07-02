const express = require('express');
const router = express.Router();
const { googleAuth, googleAuthCallback } = require('../controllers/oAuthCtrl');

router.get('/google', (req, res, next) => {
  console.log('[OAuth] Hit /auth/google');
  next();
}, googleAuth);

router.get('/google', googleAuth);

router.get('/google/callback', googleAuthCallback);

module.exports = router;
