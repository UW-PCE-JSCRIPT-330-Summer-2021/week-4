//Similar to Week 3 assignment
//Followed Week 3 .create, .findOne, .find

const mongoose = require('mongoose')
const Note = require('../models/note')

module.exports = {};

//should create a note for the given user
module.exports.createNote = async (userId, noteObj) => {
    return await Note.create({ userId: userId, noteObj: noteObj });
};

//should get note for userId and noteID (_id)
module.exports.getNote = async (userId, noteId) => {
    if (noteId) {
        return await Note.findOne({ _id: noteId, userId: userId});
    }
    else {
        return false;
    }
};


//should get all notes for userId
module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId: userId })
};

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;