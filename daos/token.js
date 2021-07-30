const mongoose = require('mongoose');

const Note = require('../models/note');
const Token = require('../models/token');
const User = require('../models/user');

module.exports = {};

//getTokenForUserId(userId) - should be an async function that returns
//a string after creating a Token record
module.exports.getTokenForUserId = async (userId) => {
    try {
        const user = await Token.findOne({
            userId: userId
        })
        return user.token;
    } catch (e) {
        throw e;
    }
}

//getUserIdFromToken(tokenString) - should be an async function that returns
//a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({
        token: tokenString
    });
    if (token) {
        return token.userId;
    } else {
        return false;
    }
}

//removeToken(tokenString) - an async function that deletes the corresponding Token record
module.exports.removeToken = async (tokenString) => {
    try {
        await Token.deleteOne({
            token: tokenString
        });
        return true;
    } catch (e) {
        throw e;
    }
}