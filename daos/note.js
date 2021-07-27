const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    return await Note.create({ userId: userId, text: noteObj });
}

module.exports.getNote = async (userId, noteId) => {
    try {
        const getNote = await Note.findOne({ _id: noteId, userId }).lean();
        if(!getNote) {
            throw new Error ("The note was not found");
        } return getNote;
    } catch (e) {
        throw new Error (e.message);
    }
}

module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId }).lean();
}
