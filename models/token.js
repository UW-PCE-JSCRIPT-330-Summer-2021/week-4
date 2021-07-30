const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  tokenString: { type: String, required: true, unique: true }
});


module.exports = mongoose.model("tokens", tokenSchema);