const mongoose = require('mongoose');

const User = require('./user');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }
});

tokenSchema.index({ userId: 1});

module.exports = mongoose.model("token", tokenSchema);