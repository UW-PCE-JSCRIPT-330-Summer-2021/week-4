const Token = require('../models/token');
const uuid = require('uuid');

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
    try {
        const userToken = await Token.create({ userId, tokenString: uuid.v4() });
        return userToken.tokenString;
    } catch (e) {
        throw new Error (e.message);
    }
}

module.exports.getUserIdFromToken = async (tokenString) => {
    const userToken = await Token.findOne({ tokenString }).lean();
    return userToken.userId;
}

module.exports.removeToken = async (tokenString) => {
    return await Token.deleteOne({ tokenString });
}
