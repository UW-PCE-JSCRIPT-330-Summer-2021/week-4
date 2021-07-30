const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, index: true, required: true }
});

module.exports = mongoose.model("tokens", tokenSchema);