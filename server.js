const express = require("express");

const routes = require("./routes");

const middleware = require("./middleware");

const server = express();
server.use(express.json());

server.use(middleware);
server.use(routes);

// server.get("/users", isLoggedIn, function(req, res) {
//     console.log("This is isLoggedIn");
// });

// server.use(async (err, req, res, next) => {  
//     console.log(err);
//     if (err.message.includes("Cast to ObjectId failed")) {   
//         res.status(400).send('Invalid id provided');  
//     } else if (err.message.includes("Password is required") || err.message.includes("data and salt arguments required") || err.message.includes("password is not defined")) {   
//         res.status(400).send('Password is required');
//     } else if (err.message.includes("duplicate key")) {   
//         res.status(409).send('Email already in use.');
//     } else if (err.message.includes("Password needed for logout")) {   
//         res.status(409).send('Password not found');
//     } else if (err.message.includes("Password match failed") || err.message.includes("Cannot read property 'password' of null")) {   
//         res.status(401).send("Password doesn't match");
//     } else if (err.message.includes("Token is Invalid") || err.message.includes("malformed")) {   
//         res.status(401).send("Token is Invalid");
//     } else if (err.message.includes("Path `userId` is required") || err.message.includes("data and salt arguments required") || err.message.includes("userId is not defined")) {   
//         res.status(400).send('User not found');
//     } else if (err.message.includes("Invalid note ID")) {   
//         res.status(404).send('Invalid note ID');
//     } else if (err.message.includes("Path `text` is required.") || err.message.includes("Cannot read property 'text' of null")) {   
//         res.status(401).send("Text is required"); 
//     } else if (err.message.includes("Token is Invalid") || err.message.includes("malformed")) {   
//         res.status(401).send("Token is Invalid");
//     } else {    
//         res.status(500).send('Something broke!')  
//     }
//     next(); 
//   });

module.exports = server;


