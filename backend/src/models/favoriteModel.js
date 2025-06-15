const pool = require('../utils/db_pool');

async function addFavorite(userId, city) {
  const [result] = await pool.query(
    'INSERT INTO favorites (user_id, city) VALUES (?, ?)',
    [userId, city]
  );
  return result.insertId;
}

async function getFavorites(userId) {
  const [rows] = await pool.query(
    'SELECT city FROM favorites WHERE user_id = ?',
    [userId]
  );
  return rows;
}

async function removeFavorite(userId, city) {
  await pool.query(
    'DELETE FROM favorites WHERE user_id = ? AND city = ?',
    [userId, city]
  );
}

module.exports = { addFavorite, getFavorites, removeFavorite };