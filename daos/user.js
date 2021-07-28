const mongoose = require('mongoose');

//const Note = require('../modles/note');
//const Token = require('../models/token');
const User = require('../models/user');

module.exports = {};

//createUser(userObj) - should store a user record
module.exports.createUser = async (userObj) => {
    return await User.create(userObj).lean();
}

//getUser(email) - should get a user record using their email
module.exports.getUser = async (email) => {
    return await User.findOne({ email }).lean();
}

//updateUserPassword(userId, password) - should update the user's
//password field
module.exports.updateUserPassword = async (userId, password) => {
    return await User.updateOne({ _id: userId }, { $set: { password } }).lean();
}