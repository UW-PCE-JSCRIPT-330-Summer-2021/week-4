const Note = require('../models/note');

module.exports = {};

module.exports.getNote = async (userId, noteId) => {
    try {
        return returnedNote = await Note.findOne({ _id: noteId, userId: userId }).lean();
    } catch (e) {
        next(e)
    }
};

module.exports.getUserNotes = async (userId) => {
    try {
        return allUserNotes = await Note.find({ userId: userId }).lean();
    } catch (e) {
        next(e)
    }
};

module.exports.createNote = async (userId, noteObj) => {
    try {
        return noteCreated = await Note.create({ userId: userId, text: noteObj });
    } catch (e) {
        next(e)
    }
};