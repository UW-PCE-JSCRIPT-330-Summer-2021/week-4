const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.ObjectId , index: true }
});

module.exports = mongoose.model("notes", noteSchema);