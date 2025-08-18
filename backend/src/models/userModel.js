const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createUser(username, email, password) {
  const hashed = await bcrypt.hash(password, 10);
  const u = new User({ username, email, password: hashed });
  await u.save();
  return u._id.toString();
}

async function findUserByEmail(email) {
  return await User.findOne({ email: String(email).toLowerCase() }).select('+password').lean();
}

async function findUserById(id) {
  return await User.findById(id).select('+password').lean();
}

async function updatePassword(userId, newHashedPassword) {
  const res = await User.updateOne({ _id: userId }, { $set: { password: newHashedPassword } });
  return res.modifiedCount > 0;
}

async function updateUsername(userId, newUsername) {
  const res = await User.updateOne({ _id: userId }, { $set: { username: newUsername } });
  return res.modifiedCount > 0;
}

module.exports = { createUser, findUserByEmail, findUserById, updatePassword, updateUsername, User };
