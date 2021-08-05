const Mongoose = require("mongoose");
const User = require("../models/user");

module.exports = {};

module.exports.getUser = async (email) => {
  return await User.findOne({ email: email }).lean();
};

module.exports.createUser = async (userObj) => {
  try {
    const user = await User.create(userObj);
    return user;
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports.updateUserPassword = async (userId, password) => {
  return await User.updateOne(
    { _id: userId },
    { $set: { password: password } }
  );
};

module.exports.getUserById = async (userId) => {
  return await User.findOne({ _id: userId }).lean();
};
