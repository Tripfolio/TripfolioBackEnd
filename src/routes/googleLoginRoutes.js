const express = require('express');
const router = express.Router();
const { handleGoogleLogin } = require('../controllers/googleLogin');

// COOP（Cross-Origin-Opener-Policy）
function coopHeaderMiddleware(req, res, next) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
}

router.post('/google', coopHeaderMiddleware, handleGoogleLogin);

module.exports = router;