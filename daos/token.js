const mongoose = require('mongoose');

//const Note = require('../models/note');
const Token = require('../models/token');
//const User = require('../models/user');

module.exports = {};

//getTokenForUserId(userId) - should be an async function that returns
//a string after creating a Token record
module.exports.getTokenForUserId = async (userId) => {
    return await Token.findOne({ userId }).lean();
}

//getUserIdFromToken(tokenString) - should be an async function that returns
//a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
    return await Token.findOne({ tokenString }).lean();
}

//removeToken(tokenString) - an async function that deletes the corresponding
//Token record
module.exports.removeToken = async (tokenString) => {
    return await Token.deleteOne({ tokenString }).lean();
}