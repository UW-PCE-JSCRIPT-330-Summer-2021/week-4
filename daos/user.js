const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.create = async (userData) => {

    try {
        const created = await User.create(userData);
        return created;
    } catch(e) {
        throw new Error('Could not create user');
    }
}

module.exports.getByEmail = async (userEmail) => {
    return await User.findOne({ email: userEmail }).lean();
}

/*
    this getById route was added because the Notes."userId"
    was matching on the User."_id" and my tokens were originally
    based on "email".  Adding this function and changing the
    token to utilize the User."_id" as well everything began
    to work as expected.
*/
module.exports.getById = async (userId) => {
    return await User.findOne({ _id: userId }).lean();
}

module.exports.updatePassword = async (userData) => {
    
    try {

        return await User.updateOne(
            { email: userData.email },
            { $set: { password: userData.password } }
        );

    } catch(e) {
        throw new Error('Could not update user password');
    }
}