const mongoose = require('mongoose');

const User = require('../models/user');

module.exports = {};
  
  module.exports.getById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return User.findOne({ _id: userId }).lean();
  }
  
  module.exports.getByLogin = async (email) => {
    return User.findOne({email: email});
  }
  
  module.exports.getByIdAndEmail = async (userId, email) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    return User.findOne({ _id: userId, email: email }).lean();
  }
  module.exports.updateById = async (userId, newObj) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }
    await User.updateOne({ _id: userId }, newObj);
    return true;
  } 
  
  module.exports.create = async (userData) => {
    try {
      const created = User.create(userData);
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