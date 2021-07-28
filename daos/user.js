const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.getUser = async (userEmail) => {
  return await User.findOne({ email: userEmail }).lean();
}

module.exports.changeUserPassword = async (userId, password) => {
  await User.updateOne({ _id: userId }, { $set: { password: password } });
  return true;
}

module.exports.createUser = async (userObj) => {
  const created = await User.create(userObj);
  return created;
}
