const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    return noteCreated = await Note.create({ userId: userId["userId"], text: noteObj["text"] });
};

module.exports.getNote = async (userId, noteId) => {
    return returnedNote = await Note.findOne({ _id: noteId, userId: userId["userId"] }).lean();
};

module.exports.getUserNotes = async (userId) => {
    return allUserNotes = await Note.find({ userId: userId["userId"] }).lean();
};