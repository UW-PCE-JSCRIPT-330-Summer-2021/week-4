const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    return await User.create(userObj);
};

module.exports.updateUserPassword = async (userId, password) => {
    return await User.updateOne({ userId }, { $set: { password } });
};

module.exports.getUserById = async (userId) => {
    return await User.findOne({ email: userId }).lean();
};