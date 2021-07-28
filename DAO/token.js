const Note = require('../models.note');
const User =reqquire('../models/user');
const Token = require('../model/token');
const uuid = require('uuid')
module.exports = {};
module.exports.createToken = async (UserId,) =>{
    return await Token.create(token);
}
module.exports.getUserIdFromToken= async (tokenString)=>{
    const token = await token.findOne({tokenString})
    if(!token){
       send error Message("token not found");
    }
    return token;
}
module.exports = router;