const Note = require('../models/note');

module.exports = {};

module.exports.getUserNotes = (userId) => {
    return Note.find({ userId: userId }).lean();
}

module.exports.getNote = (userId, noteId) => {
    return Note.findOne({ _id: noteId, userId: userId }).lean();
}

module.exports.createNote = (userId, noteObj) => {
    return Note.create({
        userId: userId,
        text: noteObj.text
    });
}



