const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    try {
        return await User.create(userObj);
    } catch (e) {
      return null;
    }
}

module.exports.getUser = async (email) => {
    try {
        return await User.findOne({ email: email }).lean();
    } catch (e) {
      next(e);
    }
}
  
module.exports.updateUserPassword = async (userId, password) => {
    try {
      return await User.updateOne({ _id: userId }, { $set: { password: password }});
    } catch (e) {
      next(e);
    }
}
