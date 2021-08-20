const mongoose = require('mongoose');
const Token = require('../models/token.js');

const { v4: uuidv4 } = require('uuid');
//uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

module.exports = {};
  
module.exports.getTokenForUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }
  const newToken = uuidv4();
  const entry = Token.create({userId: userId, token: newToken });
  return entry;
}
  
module.exports.getUserIdFromToken = async (tokenString) => {
  // console.log(`getUserIdFromToken = START`);
  // console.log(`tokenString = ${tokenString}`);
  const tokenData = Token.findOne({token: tokenString});
  return tokenData;
}
  
module.exports.removeToken = async (tokenData) => {
  console.log(`removeToken = START`);
  console.log(`tokenData = ${tokenData}`);
  return Token.deleteOne(tokenData);
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;