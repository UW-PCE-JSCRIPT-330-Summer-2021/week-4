const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
  try {
    noteObj.userId = userId;  
    const created = await Note.create(noteObj);
    return created;
  } catch (e) {
    throw e;
  }
}

module.exports.getUserNote = async (userId) => {
    return await Note.find({ userId: userId }).lean();
}

module.exports.getNote = async (userId, noteId) => {
  try {
    const result = await Note.findOne({ _id: noteId, userId: userId });
    return result;
  } catch (e) {
    throw e;
  }
}