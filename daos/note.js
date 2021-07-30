const mongoose = require('mongoose');

const Note = require('../models/note');
const Token = require('../models/token');
const User = require('../models/user');

module.exports = {};

//createNote(userId, noteObj) - should create a note for the given user
module.exports.createNote = async (userId, noteObj) => {
    try {
        const newNote = await Note.create({
            userId: userId,
            text: noteObj
        });
        return newNote;
    } catch (e) {
        throw e;
    }
}

//getNote(userId, noteId) - should get note for userId and noteId (_id)
module.exports.getNote = async (userId, noteId) => {
    try {
        const findNote = await Note.findOne({
            userId: userId,
            _id: noteId
        });
        return findNote;
    } catch (e) {
        throw e;
    }
}

//getUserNotes(userId) - should get all notes for userId
module.exports.getUserNotes = async (userId) => {
    try {
        const userNote = await Note.find({
            userId: userId
        });
        return userNote;
    } catch (e) {
        throw e;
    }
}