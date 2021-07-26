const Token = require('../models/token');
const User = require('../models/user');
const uuid = require('uuid');

module.exports = {};

module.exports.getTokenForUserEmail = async (userEmail) => {
    try {
        const user = await User.findOne({ email: userEmail });
        const newToken = await Token.create({userId: user._id, token: uuid.v4()});
        return newToken.token;

    } catch(e) {
        throw new Error(e.message);
    }
}

module.exports.getUserFromToken = async (token) => {
    
    try {

        const userToken = await Token.findOne({ token }).lean();
        return userToken.userId;
    
    } catch(e) {
        throw new Error(e.message);
    }
}

module.exports.removeToken = async(token) => {

    try {
        return await Token.deleteOne({ token });
    } catch(e) {
        throw new Error(e.message);
    }
}