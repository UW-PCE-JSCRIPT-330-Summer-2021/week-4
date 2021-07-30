const uuid = require('uuid');

const Token = require('../models/token');

module.exports = {};

module.exports.getUserIdFromToken = async (tokenString) => {
    try {
        const token = await Token.findOne({ tokenString }).lean();
        return token.userId;
    } catch (e) {
        throw e;
    }
}

module.exports.removeToken = async (tokenString) => {
    try {
        const removed = await Token.deleteOne({ tokenString });
        return removed;
    } catch (e) {
        throw e;
    }
}

module.exports.getTokenForUserId = async (userId) => {
    try {
        const token = uuid.v4();
        const created = await Token.create({ userId, tokenString: token });
        return created;
    } catch (e) {
        throw e;
    }
}