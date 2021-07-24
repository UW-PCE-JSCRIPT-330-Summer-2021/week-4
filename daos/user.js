const mongoose = require('mongoose');
const User = require('../models/user');

const Token = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
    const user = await User.create(userObj);
    return user;
}

module.exports.getUser = async (email) => {
    return await User.findOne({ email }).lean();
}

module.exports.updateUserPassword = async (userId, password) => {
    try {
        await User.updateOne( { _id: userId }, { $set: { password } } );
        return true;
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}