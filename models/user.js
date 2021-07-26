const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, reqired: true, unique: true, index: true},
  password: {type: String, required: true}
});

userSchema.index({ email: 'text' });

module.exports = mongoose.model("users", userSchema);