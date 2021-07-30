//Similar to Week 3 assignment
//Followed Week 3 .create, .findOne, .find

const mongoose = require('mongoose')
const Note = require('../models/note')

module.exports = {};

//should create a note for the given user
module.exports.createNote = async (userId, noteObj) => {
    //take ther noteObj as a whole, which includes the userId
    noteObj.userId = userId;
    return await Note.create(noteObj);
};

//should get note for userId and noteID (_id)
module.exports.getNote = async (userId, noteId) => {
    return await Note.findOne({ _id: noteId, userId: userId });
};


//should get all notes for userId
module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId: userId });
};