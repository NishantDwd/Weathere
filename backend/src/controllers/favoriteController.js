
const { addFavorite, getFavorites, removeFavorite } = require('../models/favoriteModel');

exports.add = async (req, res) => {
  const userId = req.user.userId;
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const id = await addFavorite(userId, city);
    if (id === null) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    res.json({ message: 'Favorite added' });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.list = async (req, res) => {
  const userId = req.user.userId;
  try {
    const favorites = await getFavorites(userId); // returns [{city}, ...]
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
    const deleted = await removeFavorite(userId, city);
    if (!deleted) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
