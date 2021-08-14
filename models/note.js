const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String, index: true }
});

module.exports = mongoose.model("notes", noteSchema);