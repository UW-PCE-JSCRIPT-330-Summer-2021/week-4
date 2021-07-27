const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.getUser = async (userEmail) => {
  return await User.findOne({ email: userEmail }).lean();
}

module.exports.updateUserPassword = async (userId, password) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }
    try {
      await User.updateOne({ _id: userId }, { $set: { password: password } });
      return true;
    } catch (e) {
      throw e;
    }
}

module.exports.createUser = async (userObj) => {
  try {
    const created = await User.create(userObj);
    return created;
  } catch (e) {
    throw e;
  }
}
