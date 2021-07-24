const mongoose = require('mongoose');

const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    // TODO: Figure out what to do
    noteObj.userId = userId;
    const note = await Note.create(noteObj);
    return note;
}

module.exports.getNote = async (userId, noteId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(noteId))
            throw new Error("The noteId is invalid.");
        return await Note.findOne({ _id: noteId, userId }).lean();
    }
    catch (e) {
        throw e;
    }
}

module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId }).lean();
}

// {
//     _id: ObjectId("2958295295829"),
//     userId: "289825928592",
//     text: "The note text"
// }