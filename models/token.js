const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: { type: String, require: true },
  userId: { type: mongoose.ObjectId, index: true },
});

module.exports = mongoose.model("tokens", tokenSchema);
