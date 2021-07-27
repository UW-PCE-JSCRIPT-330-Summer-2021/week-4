const mongoose = require('mongoose');

// add user ID
const noteSchema = new mongoose.Schema({
	text: { type: String, required: true },
	userId: { type: mongoose.ObjectId, index: true },
});


module.exports = mongoose.model("notes", noteSchema);