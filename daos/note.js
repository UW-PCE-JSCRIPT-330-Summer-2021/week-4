const Note = require('../models/note');

module.exports = {};

module.exports.getUserNotes = async (userId) => {
    const notes = await Note.find({ userId: userId });
    return notes;
}

module.exports.getNote = async (userId, noteId) => {
    const note = await Note.findOne({ _id: noteId, userId: userId }).lean();
    if(!note){
        throw new Error('Not found');
    }
    return note;
}

module.exports.createNote = async (userId, noteObj) => {
    return await Note.create({
        userId: userId,
        text: noteObj.text
    });
}



