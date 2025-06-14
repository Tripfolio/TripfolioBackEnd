const express = require('express');
const router = express.Router();
const { updateUserPassword } = require('../controllers/userController');

router.put('/:id/password', updateUserPassword); // 密碼修改

module.exports = router;