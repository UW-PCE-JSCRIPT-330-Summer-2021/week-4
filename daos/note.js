const mongoose = require('mongoose');
const Note = require('../models/note');

module.exports = {};
//Create User Note
module.exports.createNote = async (userId, noteObj) => {
  try {
		noteObj.userId = userId;
		const created = await Note.create(noteObj);
		return created;
	} catch (e) {
		throw e; // Throw Exception
	}
};


module.exports.getUserNotes = async (userId) => {
	return await Note.find({ userId }).lean();
};

module.exports.getNote = async (userId, noteId) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(noteId))
			throw new Error('noteId is invalid.');
		return await Note.findOne({ _id: noteId, userId }).lean();
	} catch (e) {
		throw e; // Throw Exception
	}
};


