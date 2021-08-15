const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');
// for uuid call: uuidv4();

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
    try {
        const retrieveToken = await Token.create({ token: uuidv4(), userId });
        return retrieveToken;
    } catch (e) {
    }
};

module.exports.getUserFromToken = async (tokenString) => {
    try {
        const findToken = await Token.findOne({ token: tokenString }).lean();
        return findToken;
    } catch (e) {
    }
};

module.exports.removeToken = async (tokenString) => {
    try{
        const deleteToken = await Token.deleteOne({ token: tokenString });
        return deleteToken;
    } catch (e) {
    }
};