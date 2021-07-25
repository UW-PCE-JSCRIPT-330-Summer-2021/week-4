const User = require('../models/user');

module.exports = {};



module.exports.getUser = async (email) => {
  return await User.findOne({ email: email }).lean();
}


module.exports.updateUserPassword = async (userId, password) => {
  return  await User.updateOne({ _id: userId }, {$set: {'password': password}});
}

module.exports.createUser = async (userObj) => {
  return await User.create(userObj);
}

module.exports.getUserById = async (userId) => {
    return await User.findOne({_id: userId}).lean();
  }