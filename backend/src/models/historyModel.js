const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, required: true, trim: true },
  searched_at: { type: Date, default: Date.now },
});

const History = mongoose.models.History || mongoose.model('History', historySchema);

/**
 * Add a history entry for a user
 * @param {string|ObjectId} userId
 * @param {string} city
 * @returns {string} id of created history entry
 */
async function addHistory(userId, city) {
  const doc = new History({ user_id: userId, city });
  await doc.save();
  return doc._id.toString();
}

/**
 * Get history for a user (most recent first)
 * Returns array of objects with { id, city, searched_at }
 * @param {string|ObjectId} userId
 */
async function getHistory(userId) {
  const docs = await History.find({ user_id: userId })
    .sort({ searched_at: -1 })
    .lean();

  return docs.map(d => ({
    id: d._id.toString(),
    city: d.city,
    searched_at: d.searched_at,
  }));
}

/**
 * Delete a single history entry by id for a user
 * @param {string|ObjectId} userId
 * @param {string} historyId
 */
async function deleteHistory(userId, historyId) {
  const res = await History.deleteOne({ _id: historyId, user_id: userId });
  return res.deletedCount || 0;
}

/**
 * Clear all history for a user
 * @param {string|ObjectId} userId
 */
async function clearHistory(userId) {
  const res = await History.deleteMany({ user_id: userId });
  return res.deletedCount || 0;
}

module.exports = { addHistory, getHistory, deleteHistory, clearHistory };
