const pool = require('../utils/db_pool');

async function createBlog(userId, username, title, content) {
  const [result] = await pool.query(
    'INSERT INTO blogs (user_id, username, title, content) VALUES (?, ?, ?, ?)',
    [userId, username, title, content]
  );
  return result.insertId;
}

async function getAllBlogs() {
  const [rows] = await pool.query(
    'SELECT id, user_id, username, title, content, created_at FROM blogs ORDER BY created_at DESC'
  );
  return rows;
}

async function deleteBlog(blogId, userId) {
  const [result] = await pool.query(
    'DELETE FROM blogs WHERE id = ? AND user_id = ?',
    [blogId, userId]
  );
  return result.affectedRows;
}

module.exports = { createBlog, getAllBlogs, deleteBlog };