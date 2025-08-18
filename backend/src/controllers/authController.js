
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail, findUserById, updatePassword, updateUsername, User } = require('../models/userModel');

// Signup
async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const userId = await createUser(username, email, password);
    const token = jwt.sign({ userId, email, username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({ token, user: { id: userId, username, email } });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to signup' });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id.toString(), email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user._id.toString(), username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to login' });
  }
}

// Reset password (by email + username)
async function resetPassword(req, res) {
  try {
    const { username, email, newPassword, confirmPassword } = req.body;
    if (!username || !email || !newPassword || !confirmPassword) return res.status(400).json({ error: 'All fields are required' });
    if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const user = await findUserByEmail(email);
    if (!user || user.username !== username) return res.status(404).json({ error: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await updatePassword(user._id.toString(), hashed);
    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
}

// Change password (authenticated)
async function changePassword(req, res) {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) return res.status(400).json({ error: 'All fields are required' });
    if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await updatePassword(userId, hashed);
    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to change password' });
  }
}

// Change username (authenticated)
async function changeUsername(req, res) {
  try {
    const userId = req.user.userId;
    const { newUsername } = req.body;
    if (!newUsername) return res.status(400).json({ error: 'New username is required' });

    // ensure unique username
    const existing = await User.findOne({ username: newUsername }).lean();
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    await updateUsername(userId, newUsername);
    const user = await findUserById(userId);

    const token = jwt.sign({ userId: user._id.toString(), email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({
      message: 'Username updated successfully',
      token,
      user: { id: user._id.toString(), username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Change username error:', err);
    return res.status(500).json({ error: 'Failed to change username' });
  }
}

module.exports = {
  signup,
  login,
  resetPassword,
  changePassword,
  changeUsername
};
