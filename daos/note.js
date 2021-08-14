const Note = require('../models/note');

module.exports = {};

module.exports.getNote = async (userId, noteId) => {
    try {
        const returnedNote = await Note.findOne({ _id: noteId, userId: userId });
        return returnedNote;
    } catch (e) {
        next(e)
    }
};

module.exports.getUserNotes = async (userId) => {
    try {
        const allUserNotes = await Note.find({ userId: userId }).lean();
        return allUserNotes;
    } catch (e) {
        next(e)
    }
};

module.exports.createNote = async (userId, noteObj) => {
    try {
        nobeObj.userId = userId;
        const noteCreated = await Note.create({ userId: userId, text: noteObj });
        return noteCreated;
    } catch (e) {
        next(e)
    }
};