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

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/upload-avatar', authenticateToken, upload.single('avatar'), uploadAvatar);
router.put('/users/password', authenticateToken, updateUserPassword);

module.exports = router;