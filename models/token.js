const mongoose = require('mongoose');

//make token unique per userId
const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, required: true }
});

//tokenSchema.index({ userId: 'text' });

module.exports = mongoose.model("tokens", tokenSchema);