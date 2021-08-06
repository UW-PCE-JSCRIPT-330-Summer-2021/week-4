const mongoose = require('mongoose');

const User = require('../models/user');

module.exports = {};

/* module.exports.getAll = (page, perPage) => {
    return Author.find().limit(perPage).skip(perPage*page).lean();
  }*/
  
  module.exports.getById = (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return User.findOne({ _id: userId }).lean();
  }
  
  module.exports.getByLogin = (email, password) => {
    return User.findOne({email: email, password: password }).lean();
  }
  /*
  module.exports.deleteById = async (authorId) => {
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return false;
    }
    await Author.deleteOne({ _id: authorId });
    return true;
  }*/
  
  module.exports.updateById = async (userId, newObj) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }
    await User.updateOne({ _id: userId }, newObj);
    return true;
  } 
  
  module.exports.create = async (userData) => {
    try {
      const created = await User.create(userData);
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