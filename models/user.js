const mongoose = require('mongoose');

//make user email unique
//each password corresponds to a unique email
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//userSchema.index({ email: 'text' });

module.exports = mongoose.model("users", userSchema);