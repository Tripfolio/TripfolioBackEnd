const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadToS3')('post');
const {
  createCommunityPost,
  getAllCommunityPosts,
  updateCommunityPost,
  deleteCommunityPost,
} = require('../controllers/community');

router.post('/community-posts', authenticateToken, upload.single('cover'), createCommunityPost);
router.get('/', getAllCommunityPosts);
router.put('/community-posts/:id', authenticateToken, upload.single('cover'), updateCommunityPost);
router.delete('/community-posts/:id', authenticateToken, deleteCommunityPost);

module.exports = router;
