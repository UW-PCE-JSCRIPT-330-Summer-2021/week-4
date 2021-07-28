const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

module.exports.getUserIdFromToken = async (tokenString) => {
  const match = await Token.findOne({ token: tokenString }).lean();
  return match;
}

module.exports.removeToken = async (tokenString) => {
  const removed = await Token.deleteOne({ token: tokenString });
  return removed;
}

module.exports.getTokenForUserId = async (userId) => {
  const token = uuidv4();
  const created = await Token.create({ userId: userId, token: token });
  return created;
}
