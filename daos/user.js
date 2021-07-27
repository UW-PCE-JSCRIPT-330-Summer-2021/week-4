const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {};

//create user
module.exports.createUser = async (userObj) => {
	try { const user = await User.create(userObj);
	return user;
} catch (e) {
     throw e;
   }
};

//get user
module.exports.getUser = async (email) => {
	return await User.findOne({ email }).lean();
};

//update user
module.exports.updateUserPassword = async (userId, password) => {
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return false;
	}
	try {
		await User.updateOne({ _id: userId }, { $set: { password: password } });
		return true;
	} catch (e) {
		throw e;
	}
};
