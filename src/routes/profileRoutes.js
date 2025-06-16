const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadAvatar");
const {
    getProfile,
    updateProfile,
    uploadAvatar,
    updateUserPassword
} = require('../controllers/profileController');

router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);
router.put('/:id/password', updateUserPassword);

module.exports = router;