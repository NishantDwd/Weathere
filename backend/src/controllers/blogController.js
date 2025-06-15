const { createBlog, getAllBlogs, deleteBlog } = require('../models/blogModel');

exports.create = async (req, res) => {
  const userId = req.user.userId;
  const username = req.user.username || req.user.email || "Anonymous";
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  try {
    const blogId = await createBlog(userId, username, title, content);
    res.json({ message: 'Blog posted', blogId });
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ error: 'Failed to post blog' });
  }
};

exports.list = async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.json({ blogs });
  } catch (err) {
    console.error('Get blogs error:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

exports.delete = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Blog id is required' });
  try {
    const affected = await deleteBlog(id, userId);
    if (affected === 0) {
      return res.status(403).json({ error: 'Not authorized or blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};