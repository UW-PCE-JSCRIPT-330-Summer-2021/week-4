const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'User email required']},
    password: { type: String, required: [true, 'Password is required'], index: true }
});

userSchema.index({ email: 1}, { unique: true});

module.exports = mongoose.model("users", userSchema);