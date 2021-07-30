const mongoose = require('mongoose');
const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');
module.exports = {};


// getTokenForUserId(userId) - should be an async function that returns a string 
// after creating a Token record
module.exports.getTokenForUserId = async (userId) => {
  try {
    const generateToken = uuidv4();
    const newToken = await Token.create({ userId: userId, token: generateToken });
    return newToken;
  } catch (e) {
    next(e);
  }
}

// getUserIdFromToken(tokenString) - should be an async function that returns a userId 
// string using the tokenString to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
  try {
    const token = await Token.findOne({ token: tokenString }).lean();
    return token;
  } catch (e) {
    next(e);
  }
}

// removeToken(tokenString) - an async function that deletes the corresponding 
// Token record
module.exports.removeToken = async (tokenString) => {
  try {
    const removeToken = await Token.deleteOne({ token: tokenString });
    return removeToken;
  } catch (e) {
    next(e);
  }
}




