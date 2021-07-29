const mongoose = require('mongoose');

//v4 UUID are generated randomly and with no inherent logic
const { v4: uuidv4 } = require('uuid');

//const Note = require('../models/note');
const Token = require('../models/token');
//const User = require('../models/user');

module.exports = {};

//getTokenForUserId(userId) - should be an async function that returns
//a string after creating a Token record
module.exports.getTokenForUserId = async (userId) => {
    const uuidToken = uuidv4();
    const tokenForUser = await Token.findOne({ 'userId': userId, 'uuidToken': uuidToken });
    return tokenForUser;
}

//getUserIdFromToken(tokenString) - should be an async function that returns
//a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
    const getUserFromToken = await Token.findOne({ 'tokenString': tokenString });
    return getUserFromToken;
}

//removeToken(tokenString) - an async function that deletes the corresponding
//Token record
module.exports.removeToken = async (tokenString) => {
    const removeUserToken = await Token.deleteOne({ 'tokenString': tokenString })
    return removeUserToken;
}