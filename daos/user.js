//Similar to Week 3 assignment
//Followed Week 3 .create, .findOne, .updateOne

const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = {};

//should store a user record
module.exports.createUser = async (userObj) => {
    const created = await User.create(userObj);
    return created;
};

//should get a user record using their email
module.exports.getUser = async (email) => {
    return await User.findOne({ email: email });
};

//should update the user's password field
module.exports.updateUserPassword = async (userId, password) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return false;
        }
        await User.updateOne({ _id: userId }, {$set: { password }});
        return true;
    }

    catch(e) {
        if (e.message.includes("validation failed")) {
            throw new BadDataError(e.message);
        }
        throw e;
    }
};

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;