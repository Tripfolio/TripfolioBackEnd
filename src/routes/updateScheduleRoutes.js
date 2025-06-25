/*const express = require('express');
const router = express.Router();

const {
  updateSchedule,
  addDayToSchedule,
  getTravelScheduleById,
} = require('../controllers/updateScheduleController');
const upload = require('../middlewares/uploadToS3')('cover');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.patch('/:id', authenticateToken, upload.single('cover'), updateSchedule);

router.post('/:id/addDay', authenticateToken, addDayToSchedule);

router.get('/:id', authenticateToken, getTravelScheduleById);

module.exports = router;*/
