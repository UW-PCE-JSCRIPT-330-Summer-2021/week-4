const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    try {
        return await User.create(userObj);
    } catch (e) {
        throw new Error ("Could not create a user");
    }
}

module.exports.getUser = async (email) => {
    try {
        return await User.findOne({ email: email }).lean();
    } catch (e) {
        throw new Error ("Could not find a user");
    }
}

module.exports.updateUserPassword = async (userId, password) => {
    try {
        return await User.updateOne({ _id: userId }, { $set: { password } });
    } catch (e) {
        throw new Error("Could not update a user\'s password");
    }
}