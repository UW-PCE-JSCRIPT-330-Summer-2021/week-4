const mongoose = require('mongoose');

//const Note = require('../models/note');
//const Token = require('../models/token');
const User = require('../models/user');

module.exports = {};

//createUser(userObj) - should store a user record
module.exports.createUser = async (userObj) => {
    const newUser = await User.create({ 'userObj': userObj });
    return newUser;
}

//getUser(email) - should get a user record using their email
module.exports.getUser = async (email) => {
    const userEmail = await User.findOne({ 'email': email });
    return userEmail;
}

//updateUserPassword(userId, password) - should update the user's
//password field
module.exports.updateUserPassword = async (userId, password) => {
    const newPassword = await User.updateOne({ '_id': userId }, { $set: { password } });
    return newPassword;
}