const mongoose = require('mongoose');

//password-hashing function
const bcrypt = require('bcrypt');

//v4 uuid are generated randomly and with no inherent logic
const { v4: uuidv4 } = require('uuid');

const Note = require('../models/note');
const Token = require('../models/token');
const User = require('../models/user');

module.exports = {};

//createUser(userObj) - should store a user record
/*
module.exports.createUser = async (userObj) => {
    const newUser = await User.create({
        userObj: userObj
    });
    return newUser;
}
*/

//within POST /login/signup and called as userDAO.signup to handle 409 conflict with repeat signup
//much cleaner approach than what I had originally
//also less confusing than having multiple if and else statements like I had before
module.exports.signup = async (email, password) => {
    //called in POST /login/signup to use bcrypt on the incoming password
    //you also mentioned that it's fine to just pass in a hard-coded number of salt rounds
    //and I don't *have* to generate that number -- implemented it in here
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        //stores user with email and encrypted password
        const newUser = await User.create({
            email: email,
            password: passwordHash
        });
        return newUser;
    } catch (e) {
        throw e;
    }
};

//getUser(email) - should get a user record using their email
module.exports.getUser = async (email) => {
    try {
        const user = await User.findOne({
            email: email
        });
        return user;
    } catch (e) {
        throw e;
    }
}

//updateUserPassword(userId, password) - should update the user's password field
module.exports.updateUserPassword = async (userId, password) => {
    try {
        const newPasswordHash = await bcrypt.hash(password, 10);
        const updatedUser = User.updateOne(
            { _id: userId },
            { password: newPasswordHash }
        );
        return updatedUser;
    } catch (e) {
        throw e;
    }
}

//called in Login: POST /login to generate a random token with uuid and return it to the user
module.exports.assignUserToken = async (userId) => {
    const tokenString = uuidv4();
    try {
        const userToken = Token.create({
            userId: userId,
            token: tokenString
        });
        return userToken;
    } catch (e) {
        throw e;
    }
}