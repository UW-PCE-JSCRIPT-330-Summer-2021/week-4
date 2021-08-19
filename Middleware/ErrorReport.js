
// const userDAO = require('../daos/user');
// const user = require("../models/user");

// const tokenDAO = require('../daos/token');
// const token = require("../models/token");
module.exports = {};

module.exports = (async (err, req, res, next) => {  
    console.log(err);
    if (err.message.includes("Cast to ObjectId failed")) {   
        res.status(400).send('Invalid id provided');  
    } else if (err.message.includes("Password is required") 
        || err.message.includes("data and salt arguments required") 
        || err.message.includes("password is not defined")) {   
            res.status(400).send('Password is required');
    } else if (err.message.includes("duplicate key")) {   
        res.status(409).send('Email already in use.');
    } else if (err.message.includes("Password needed for logout")) {   
        res.status(409).send('Password not found');
    } else if (err.message.includes("Invalid note ID")) {   
        res.status(404).send('Invalid note ID');
    } else if (err.message.includes("Password match failed") 
        || err.message.includes("Cannot read property 'password' of null")) {   
            res.status(401).send("Password doesn't match");
    } else if (err.message.includes("Token is Invalid") 
        || err.message.includes("User not found") 
        || err.message.includes("malformed") 
        || err.message.includes("Not Authorized")) {   
            res.status(401).send("Token is Invalid");
    } else {    
        res.status(500).send('Something broke!')  
    }
    next(); 
  });