const express = require('express');
const router = express.Router();

const { createSchedule, deleteSchedule } = require('../controllers/scheduleController');
const upload = require('../middlewares/uploadToS3')('cover');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getSchedules } = require('../controllers/getSchedule');
const {
  getTravelScheduleById,
  updateSchedule,
} = require('../controllers/updateScheduleController');

router.post('/', authenticateToken, upload.single('cover'), createSchedule);
router.get('/user', authenticateToken, getSchedules);
router.delete('/:id', authenticateToken, deleteSchedule);
router.get('/:id', authenticateToken, getTravelScheduleById);
router.patch('/:id', authenticateToken, upload.single('cover'), updateSchedule);
router.put('/:id', authenticateToken, upload.single('cover'), updateSchedule);

module.exports = router;
