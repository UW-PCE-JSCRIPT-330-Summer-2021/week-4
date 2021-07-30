const mongoose = require('mongoose');
const Note = require('../models/note');
module.exports = {};

// createNote(userId, noteObj) - should create a note for the given user
module.exports.createNote = async (userId, noteObj) => {
  noteObj.userId = userId;
  const note = await Note.create(noteObj);
  return note;
}


// getNote(userId, noteId) - should get note for userId and noteId (_id)
module.exports.getNote = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, userId: userId }).lean();
  return note;
}

// getUserNotes(userId) - should get all notes for userId
module.exports.getUserNotes = async (userId) => {
  const notes = await Note.find({ userId: userId }).lean();
  return notes;
}




