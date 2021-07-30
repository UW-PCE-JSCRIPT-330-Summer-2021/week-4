const Note = require('../models/note');

const User = require('../models/user');

const Token = require('../models/token');

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
  return await Token.findOne({ userId: userId }).lean();
};

module.exports.create = async (token, userId) => {
  return await Token.create({
    token: token,
    userId: userId,
  });
};

module.exports.getUserIdFromToken = async (tokenString) => {
  const token = await Token.findOne({ token: tokenString });
  if (!token) {
    return null;
  }
  return token.userId;
};

module.exports.removeToken = async (tokenString) => {
  return await Token.remove({ token: tokenString });
};
