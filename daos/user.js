const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    try {
        const user = await User.create(userObj)
        return user;
    } catch (e) {
        return null;
    }
}

module.exports.getUser = async (email) => {
    try {
        return await User.findOne({ email: email }).lean();
    } catch (e) {
        return null;
    }
}

module.exports.updateUserPassword = async (userId, password) => {
    try {
        return await User.updateOne({ _id: userId }, { $set: { 'password': password } });
    } catch (e) {
        return null;
    }
}

module.exports.getAll = () => {
    return User.find().lean();
}