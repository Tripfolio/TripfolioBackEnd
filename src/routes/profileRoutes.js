const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadAvatar");
const { authenticateToken } = require("../middlewares/authMiddleware")
const {
    getProfile,
    updateProfile,
    uploadAvatar,
    updateUserPassword
} = require('../controllers/profileController');

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), uploadAvatar);
router.put('/users/password', authenticateToken, updateUserPassword);

module.exports = router;