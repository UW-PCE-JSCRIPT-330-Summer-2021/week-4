const mongoose = require('mongoose');

//token should not be unique
//need to allow a user to have multiple tokens, which allows them to log in and out on multiple browsers/devices at same time
const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true }
});

//tokenSchema.index({ userId: 'text' });

module.exports = mongoose.model("tokens", tokenSchema);