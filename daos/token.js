const uuid = require("uuid");

const Token = require("../models/token");

module.exports = {};

module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({ token: tokenString }).lean();
    return token.userId;
};

module.exports.removeToken = async (tokenString) => {
    const removed = await Token.deleteOne({ token: tokenString });
    return removed;
};

module.exports.getTokenForUserId = async (userId) => {
    const token = uuid.v4();
    const created = await Token.create({ userId, token });
    return created;
};