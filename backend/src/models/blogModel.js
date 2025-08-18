const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

async function createBlog(userId, username, title, content) {
  const b = new Blog({ user_id: userId, username, title, content });
  await b.save();
  return {
    id: b._id.toString(),
    username: b.username,
    title: b.title,
    content: b.content,
    created_at: b.created_at
  };
}

async function getAllBlogs() {
  const docs = await Blog.find().sort({ created_at: -1 }).lean();
  return docs.map(d => ({
    id: d._id.toString(),
    user_id: d.user_id?.toString?.() || null,
    username: d.username,
    title: d.title,
    content: d.content,
    created_at: d.created_at
  }));
}

async function deleteBlog(blogId, userId) {
  // Only allow owner to delete
  const res = await Blog.deleteOne({ _id: blogId, user_id: userId });
  return res.deletedCount || 0;
}

module.exports = { createBlog, getAllBlogs, deleteBlog, Blog };
