
 const Token = require('../models/token')
 const uuid = require('uuid');
 const { v4: uuidv4 } = require('uuid');

 module.exports = {}
//remove token
 module.exports.removeToken = async (tokenString) => {
     return await Token.deleteOne({ tokenString })
 }
//get id from token
 module.exports.getUserIdFromToken = async (tokenString) => {
		const token = await Token.findOne({ tokenString }).lean();
		return (token || {}).userId;
 };

//get token for user id
  module.exports.getTokenForUserId = async (userId) => {
		try {
			const token = await Token.create({ tokenString: uuid.v4(), userId });
			return token.tokenString;
		} catch (e) {
			throw new Error(e.message);
		}
	};