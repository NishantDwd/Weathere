const { addHistory, getHistory, deleteHistory, clearHistory } = require('../models/historyModel');

exports.add = async (req, res) => {
  const userId = req.user.userId;
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    await addHistory(userId, city);
    res.json({ message: 'History added' });
  } catch (err) {
    console.error('Add history error:', err);
    res.status(500).json({ error: 'Failed to add history' });
  }
};

exports.list = async (req, res) => {
  const userId = req.user.userId;
  try {
    const history = await getHistory(userId);
    res.json({ history });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Failed to get history' });
  }
};

exports.delete = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'History id is required' });
  try {
    await deleteHistory(userId, id);
    res.json({ message: 'History entry deleted' });
  } catch (err) {
    console.error('Delete history error:', err);
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
};

exports.clear = async (req, res) => {
  const userId = req.user.userId;
  try {
    await clearHistory(userId);
    res.json({ message: 'All history cleared' });
  } catch (err) {
    console.error('Clear history error:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};