const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');
// for uuid call: uuidv4();

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
    const retrieveToken = await Token.create({ userId: userId, token: uuidv4() });
    return retrieveToken;
};

module.exports.getUserFromToken = async (tokenString) => {
    const findToken = await Token.findOne({ token: tokenString }).lean();
    return findToken;
};

module.exports.removeToken = async (tokenString) => {
    const deleteToken = await Token.deleteOne({ token: tokenString });
    return deleteToken;
};