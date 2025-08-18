
const { createBlog, getAllBlogs, deleteBlog } = require('../models/blogModel');

exports.create = async (req, res) => {
  const userId = req.user.userId;
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  try {
    const username = req.user.username || 'User';
    const blog = await createBlog(userId, username, title, content);
    res.json({ message: 'Blog created', blog });
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ error: 'Failed to create blog' });
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
    const deleted = await deleteBlog(id, userId);
    if (!deleted) return res.status(404).json({ error: 'Blog not found or unauthorized' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
