const mongoose = require('mongoose');

const User = require('./user');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }
});

noteSchema.index({ userId: 1});

module.exports = mongoose.model("note", noteSchema);