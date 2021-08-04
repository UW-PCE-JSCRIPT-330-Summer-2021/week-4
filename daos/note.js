const Note = require('../models/note');
module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    noteObj.userId = userId;
    return await Note.create(noteObj);
}

module.exports.getNote = async (userId, noteId) => {
    return await Note.findOne({ _id: noteId, userId: userId }).lean();
}

module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId: userId }).lean();
}
