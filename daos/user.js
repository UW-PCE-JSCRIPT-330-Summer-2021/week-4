const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    try {
        return await User.create(userObj);
    } catch (e) {
        next(e);
    }
};

module.exports.getUser = async (email) => {
    try {
        return await User.findOne({ email }).lean();
    } catch (e) {
        next(e)
    }
};

module.exports.updateUserPassword = async (userId, password) => {
    try {
        return await User.updateOne({ userId }, { $set: { password } });
    } catch (e) {
        next(e)
    }
};

module.exports.getUserById = async (userId) => {
    try {
        return await User.findOne({ _id: userId }).lean();
    } catch (e) {
        next(e)
    }
};