const mongoose = require('mongoose');

const Note = require('../models/note');

module.exports = {};

module.exports.getById = async (noteId, userId) => {
  //  if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return null;
  // }
  return Note.findOne({ _id: noteId, userId: userId }).lean();
}
  
module.exports.getByUserId = async (userId) => {
  return Note.find({userId: userId});
}
  
  module.exports.create = async (noteData) => {
    try {
      const created = Note.create(noteData);
      return created;
    } catch (e) {
      if (e.message.includes('validation failed') || e.message.includes('duplicate key')) {
        throw new BadDataError(e.message);
      }
      throw e;
    }
  }


class BadDataError extends Error {};
  module.exports.BadDataError = BadDataError;