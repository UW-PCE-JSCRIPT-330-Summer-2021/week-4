const User =require('../models/user');
module.exports ={}
module.exports.createUser = async (user) =>{
    return await User.create(user);
}
module.exports.getUser= async (UserId)=>{
    const user = await user.findOne({_id:UserId}). learn();

    }
    return user;
    module.exports = router;