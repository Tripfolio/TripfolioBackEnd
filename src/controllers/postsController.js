const { getPaginatedPosts } = require('../services/postsModel');
const HTTP = require('../constants/httpStatus');
async function getPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const posts = await getPaginatedPosts(page, limit);
    res.status(HTTP.OK).json({ posts });
  } catch (error) {

    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch posts' });
  }
}

module.exports = {
  getPosts,
};
