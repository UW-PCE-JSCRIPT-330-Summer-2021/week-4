const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    try {
        return await User.create(userObj);
    } catch (e) {
    }
};

module.exports.updateUserPassword = async (userId, password) => {
    try {
        return await User.updateOne({ userId }, { $set: { password } });
    } catch (e) {
    }
};

module.exports.getUserById = async (userId) => {
    try {
        return await User.findOne({ email: userId }).lean();
    } catch (e) {
    }
};