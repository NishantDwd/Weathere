const pool = require('../utils/db_pool');

async function addHistory(userId, city) {
  const [result] = await pool.query(
    'INSERT INTO history (user_id, city) VALUES (?, ?)',
    [userId, city]
  );
  return result.insertId;
}

async function getHistory(userId) {
  const [rows] = await pool.query(
    'SELECT id, city, searched_at FROM history WHERE user_id = ? ORDER BY searched_at DESC',
    [userId]
  );
  return rows;
}

async function deleteHistory(userId, historyId) {
  await pool.query(
    'DELETE FROM history WHERE user_id = ? AND id = ?',
    [userId, historyId]
  );
}

async function clearHistory(userId) {
  await pool.query(
    'DELETE FROM history WHERE user_id = ?',
    [userId]
  );
}

module.exports = { addHistory, getHistory, deleteHistory, clearHistory };