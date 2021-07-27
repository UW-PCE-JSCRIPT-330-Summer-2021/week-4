const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenString: { type: String, required: true },
  userId: { type: String, index: true, required: true }
});


module.exports = mongoose.model("tokens", tokenSchema);