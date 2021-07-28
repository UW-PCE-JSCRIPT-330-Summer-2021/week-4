//Similar syntax from /models/note

const mongoose = require('mongoose');

//Email is to be required, and unique to each userid
const userSchema = new mongoose.Schema({
  email: { type: String, index: true, required: true, unique: true},
  password: { type: String, required: true }
});


//userSchema.index({ email: 'text' });

module.exports = mongoose.model("users", userSchema);