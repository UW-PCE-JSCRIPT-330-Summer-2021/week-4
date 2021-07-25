const mongoose = require('mongoose');
const Note = require('../models/note');

module.exports = {};

module.exports.create = async (userId, noteObj) => {
    try {
        noteObj.userId = userId;

        const createdNote = await Note.create(noteObj);
        return createdNote;
    } catch(e) {
        throw new Error('Could not create note');
    }
}

module.exports.getNote = async (userId, noteId) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error('noteId is invalid');
      } else {
        try {
            return await Note.findOne({_id: noteId, userId}).lean();
        } catch (e) {
            throw new Error(e.message);
        }
      }
}

module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId }).lean();
}