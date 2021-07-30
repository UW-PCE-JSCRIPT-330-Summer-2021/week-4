const User = require('../models/user');

module.exports.getUser = async (userEmail) => {
  return await User.findOne({ email: userEmail }).lean();
}

module.exports.createUser = async (newUser) => {
  return await User.create(newUser);
}

module.exports.updateUserPassword = async (userId, hashedPassword) => {
  return await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
}