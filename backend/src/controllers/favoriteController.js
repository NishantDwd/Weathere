const { addFavorite, getFavorites, removeFavorite } = require('../models/favoriteModel');

exports.add = async (req, res) => {
  const userId = req.user.userId;
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    await addFavorite(userId, city);
    res.json({ message: 'Favorite added' });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.list = async (req, res) => {
  const userId = req.user.userId;
  try {
    const favorites = await getFavorites(userId);
    res.json({ favorites });
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

exports.remove = async (req, res) => {
  const userId = req.user.userId;
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    await removeFavorite(userId, city);
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};