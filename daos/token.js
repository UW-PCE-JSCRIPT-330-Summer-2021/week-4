const Token = require('../models/token');
const { v4: uuid } = require('uuid');

module.exports.createToken = async (userId) => {
  return await Token.create({ token: uuid(), userId: userId });
}

module.exports.removeToken = async (token) => {
  return await Token.deleteOne({ token: token });
}

module.exports.getUserFromToken = async (token) => {
  return await Token.findOne({ token: token }).lean();
}
