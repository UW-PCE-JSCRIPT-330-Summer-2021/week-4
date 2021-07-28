//Similar to Week 3 assignment
//Followed Week 3 .create, .findOne, .deleteOne

const mongoose = require('mongoose')
const Token = require('../models/token')

const { v4: uuidv4 } = require('uuid');

module.exports = {};

//should be an async function that returns a string ater creating a Token record
module.exports.getTokenForUserId = async (userId) => {
    try {
        const created = await Token.create({ userId: userId, token: uuidv4() });
        return created;
    }

    catch(e) {
        if (e.message.includes("validation failed")) {
            throw new BadDataError(e.message);
        }
        throw e;
    }
};

//should be an async function that returns a userId string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({ token: tokenString });
    if (token) {
        return token.userId;
    }
    else {
        return false;
    }

};

//an async function that deletes the corresponding Token record
module.exports.removeToken = async (tokenString) => {
    return await Token.deleteOne({ token: tokenString });
};

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;