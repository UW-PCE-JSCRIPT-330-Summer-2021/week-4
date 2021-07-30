const Note = require('../models/note');

module.exports.createNote = async (newNote) => {
  return created = await Note.create(newNote);
}

module.exports.getAll = async (userId) => {
  return allNotes = await Note.find({ userId: userId }).lean();
}

module.exports.getUserNote = async (userId, noteId) => {
  return await Note.findOne({ userId: userId, _id: noteId });
}