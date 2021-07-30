const mongoose = require('mongoose');
const User = require('../models/user');
module.exports = {};

// createUser(userObj) - should store a user record
module.exports.createUser = async (userObj) => {
  try {
    const user = await User.create(userObj);
    return user;
  } catch (e) {
    return null;
  }
}

// getUser(email) - should get a user record using their email
module.exports.getUser = async (email) => {
  try {
    const user = await User.findOne({ email: email }).lean();
    return user;
  } catch (e) {
    next(e);
  }
}

// updateUserPassword(userId, password) - should update the user's password field
module.exports.updateUserPassword = async (userId, password) => {
  try {
    const updatedPassword = await User.updateOne({ _id: userId }, { $set: { password: password }});
    return updatedPassword;
  } catch (e) {
    next(e);
  }
}




