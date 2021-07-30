//Similar to Week 3 assignment
//Followed Week 3 .create, .findOne, .deleteOne

const mongoose = require('mongoose')
const Token = require('../models/token')

const { v4: uuidv4 } = require('uuid');

module.exports = {};

//should be an async function that returns a string ater creating a Token record
module.exports.getTokenForUserId = async (userId) => {
    //to generate random tokens, we use the uuid library
    //tokens with be generate randomly per userId
    const created = await Token.create({ userId: userId, token: uuidv4() });
    return created;

};

//should be an async function that returns a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
    //finds one token and returns the userId corresponding to that token
    return await Token.findOne({ token: tokenString });
};

//an async function that deletes the corresponding Token record
module.exports.removeToken = async (tokenString) => {
    //deletes one token
    return await Token.deleteOne({ token: tokenString });
};