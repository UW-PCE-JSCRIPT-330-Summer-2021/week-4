const mongoose = require('mongoose');
const uuid = require('uuid');

const Token = require('../models/token');

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
  try {
    return await Token.create({ tokenString: uuid.v4(), userId }).tokenString;
  } catch(e) {
    throw new Error(e.message);
  }
}

module.exports.getUserIdFromToken = async (tokenString) => {
  try {
    return await Token.findOne({ token: tokenString }).lean();
  } catch (e) {
    throw e;
  }
}

module.exports.removeToken = async (tokenString) => {
  try {
    return await Token.deleteOne({ token: tokenString });
  } catch (e) {
    throw e;
  }
}