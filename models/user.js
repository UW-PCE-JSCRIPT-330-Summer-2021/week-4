const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, requried: true }
});


module.exports = mongoose.model("users", userSchema);