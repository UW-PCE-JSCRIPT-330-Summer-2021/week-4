const mongoose = require('mongoose');
const uuid = require('uuid');

const Token = require('../models/token');

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
    try {
        const token = await Token.create({ tokenString: uuid.v4(), userId });
        return token.tokenString;
    }
    catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({ tokenString }).lean();
    return (token || {}).userId;
}

module.exports.removeToken = async (tokenString) => {
    return await Token.deleteOne({ tokenString });
}