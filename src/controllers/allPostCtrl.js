const { getPaginatedPosts } = require("../models/allPostsSchema");

async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const posts = await getPaginatedPosts(page, limit);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
}

module.exports = {
  getAllPosts,
};
