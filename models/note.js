const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, index: true, required: true },
  text: { type: String, required: true }
});


module.exports = mongoose.model("notes", noteSchema);