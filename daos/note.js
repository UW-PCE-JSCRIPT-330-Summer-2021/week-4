const mongoose = require('mongoose');

const Note = require('../models/note');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
  try {
    noteObj.userId = userId;
    return await Note.create(noteObj);
  } catch (e) {
    throw e;
  }
}

module.exports.getNote = async (userId, noteId) => {
  try {
    return await Note.findOne({ userId: userId, _id: noteId });
  } catch (e) {
    throw e;
  }
}

module.exports.getUserNotes = async (userId) => {
  try {
    return await Note.find({ userId }).lean();
  } catch (e) {
    throw e;
  }
}
