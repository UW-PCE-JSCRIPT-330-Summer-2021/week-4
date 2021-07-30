//Similar to Week 3 assignment
//Followed Week 3 .create, .findOne, .updateOne

const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = {};

//should store a user record
module.exports.createUser = async (userObj) => {
    //creates a userObj
    const created = await User.create(userObj);
    return created;
};

//should get a user record using their email
module.exports.getUser = async (email) => {
    //finds a user based on their email
    return await User.findOne({ email: email });
};

//should update the user's password field
module.exports.updateUserPassword = async (userId, password) => {
    /*if (!mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }*/
    //sets the user's password according to their userId
    await User.updateOne({ _id: userId }, { $set: { password: password } });
    return true;
};