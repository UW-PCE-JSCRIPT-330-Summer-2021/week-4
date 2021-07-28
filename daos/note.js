const mongoose = require('mongoose');

const Note = require('../models/note');
//const Token = require('../models/token');
//const User = require('../models/user');

module.exports = {};

//createNote(userId, noteObj) - should create a note for the given user
module.exports.createNote = async(userId, noteObj) => {
    const newNote = await Note.create( { 'userId': userId, 'text': noteObj });
    return newNote;
}

//getNote(userId, noteId) - should get note for userId and noteId (_id)
module.exports.getNote = async(userId, noteId) => {
    const findNote = await Note.findOne( { '_id': noteId, 'userId': userId });
    return findNote;
}

//getUserNotes(userId) - should get all notes for userId
module.exports.getUserNotes = async(userId) => {
    const userNote = await Note.find({ 'userId': userId });
    return userNote;
}