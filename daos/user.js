const mongoose = require('mongoose');
const User = require('../models/user');

const bcrypt = require('bcrypt');

module.exports = {};

module.exports.create = async (userData) => {

    try {
        const created = await User.create(userData);
        return created;
    } catch(e) {
        throw new Error('Could not create user');
    }
}

module.exports.getByEmail = (userEmail) => {
    return User.findOne({ email: userEmail }).lean();
}

module.exports.updatePassword = async (userData) => {
    try {
        return await User.updateOne({ email: userData.email }, {$set: { password: userData.password }});
    } catch(e) {
        throw new Error('Could not update user password');
    }
}