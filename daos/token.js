const Token = require('../models/token');
const uuid = require('uuid');

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
    try {
        return await Token.create({ userId: userId, token: uuid.v4() });
    } catch (e) {
        next(e);
    }
}

module.exports.getUserIdFromToken = async (tokenString) => {
    try {
        return await Token.findOne({ token: tokenString }).lean();
    } catch (e) {
        next(e);
    }
}

module.exports.removeToken = async (tokenString) => {
    try {
        return await Token.deleteOne({ token: tokenString });
    } catch (e) {
        next(e);
    }
}
