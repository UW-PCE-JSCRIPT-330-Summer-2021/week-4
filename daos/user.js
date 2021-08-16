const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    return await User.create(userObj);
};

module.exports.updateUserPassword = async (userId, password) => {
    const user = await User.findOne({ email: userId });
    return await User.updateOne({ userId: user._id }, { $set: { password } });
};

module.exports.getUserById = async (userId) => {
    return await User.findOne({ email: userId }).lean();
};