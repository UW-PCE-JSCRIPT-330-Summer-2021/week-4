const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObject) => {
  noteObject.userId = userId;
  const created = await Note.create(noteObject);
  return created;
}

module.exports.getAll = async (userId) => {
  const allNotes = await Note.find({ userId: userId }).lean();
  return allNotes;
}

module.exports.getOneNote = async (userId, noteId) => {
  const result = await Note.findOne({ _id: noteId, userId: userId });
  return result;
}
