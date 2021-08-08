const Note = require('../models/note');

module.exports = {};

module.exports.getNote = async (userId, noteId) => {
    const returnedNote = await Note.findOne({ _id: noteId, userId: userId });
    return returnedNote;
};

module.exports.getUserNotes = async (userId) => {
    const allUserNotes = await Note.find({ userId: userId }).lean();
    return allUserNotes;
};

module.exports.createNote = async (userId, noteObj) => {
    const noteCreated = await Note.create({ userId: userId, text: noteObj });
    return noteCreated;
};