const express = require('express');
const router = express.Router();
// const upload = require('../middlewares/uploadAvatar');
const {
    getMember,
    updateMember,
    updatePassword,
    uploadAvatar,
    handleGoogleLogin
} = require('../controllers/memberController');

router.get('/members/:id', getMember);
router.put('/members/:id', updateMember);
router.put('/members/:id/password', updatePassword);
// router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);
router.post('/auth/google', handleGoogleLogin);


module.exports = router;