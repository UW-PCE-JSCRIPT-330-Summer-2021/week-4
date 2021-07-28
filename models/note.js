const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true }
});

module.exports = mongoose.model("notes", noteSchema);