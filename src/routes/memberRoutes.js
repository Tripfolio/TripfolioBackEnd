const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadAvatar');
const {
    getMember,
    updateMember,
    updatePassword,
    uploadAvatar
} = require('../controllers/memberController');

router.get('/:id', getMember);
router.put('/:id', updateMember);
router.put('/:id/password', updatePassword);
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;