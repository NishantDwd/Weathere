
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// unique per user + city
favoriteSchema.index({ user_id: 1, city: 1 }, { unique: true });

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);

/**
 * Add a favorite for a user. Returns id string or null if duplicate.
 */
async function addFavorite(userId, city) {
  try {
    const doc = new Favorite({ user_id: userId, city });
    await doc.save();
    return doc._id.toString();
  } catch (err) {
    // duplicate key
    if (err && err.code === 11000) {
      return null;
    }
    throw err;
  }
}

/**
 * Get favorites for a user. Returns array of { city } objects to match previous API shape.
 */
async function getFavorites(userId) {
  const docs = await Favorite.find({ user_id: userId }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ city: d.city }));
}

/**
 * Remove favorite by city for a user. Returns number of deleted docs.
 */
async function removeFavorite(userId, city) {
  const res = await Favorite.deleteOne({ user_id: userId, city });
  return res.deletedCount || 0;
}

module.exports = { addFavorite, getFavorites, removeFavorite, Favorite };
