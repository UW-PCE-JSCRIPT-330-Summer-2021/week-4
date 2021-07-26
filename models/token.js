const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {type: String, reqired: true},
  token: {type: String, required: true}
});

module.exports = mongoose.model("tokens", tokenSchema);