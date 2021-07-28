const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
  return await User.create(userObj);
}

module.exports.getUser = async (email) => {
  return await User.findOne({ email: email }).lean();
}

module.exports.updateUserPassword = async (userId, password) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: password } });
    return true;
  } catch (e) {
    throw e;
  }
}

