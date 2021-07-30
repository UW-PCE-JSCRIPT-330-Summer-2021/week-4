const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

//uses bcrypt libray for securely storing passwords
const bcrypt = require('bcrypt');

//POST /signup -
//should use bcrypt on the incoming password.
//Store user with their email and encrypted password
//handle conflicts when the email is already in use
router.post("/signup", async (req, res, next) => {
    //email and password is accessed from the body of the request
    const { email, password } = req.body;

    //check if email is entered and/or if pass is entered
    if (!email || !password) {
        //should return 400 without a password, as well as email
        res.sendStatus(400);
    }
    else if (email === '' || password === '') {
        //should return 400 with an empty password, as well as email
        res.sendStatus(400);
    }
    //else if password and email is not empty
    else {
    try {
        //get the user's email using the user DAO
        const user = await userDAO.getUser(email);
        if (user) {
            //should return a 409 with a repeat signup
            res.sendStatus(409);
        }
        //else, create an encrypted password for the user using the email they provided
        else {
            //bcrypt.hash encrypts the password string entered by the user
            const encryptedPass = await bcrypt.hash(password, 10);
            //user's info is email and encrypted version of their password
            const newUser = ({ email, password: encryptedPass });
            //creates the user based on new info
            const madeUser = await userDAO.createUser(newUser);
            res.json(madeUser);
        }
    }
    catch (e) {
        next(e);
    }
    }
});

//POST / -
//find the user with the provided email. 
//Use bcrypt to compare stored password with the incoming password.
//If they match, generate a random token with uuid and return it to the user
router.post("/", async (req, res, next) => {
    //email and password is accessed from the body of the request
    const { email, password } = req.body;

    //check if login email exists or is empty
    if (!email || email === '') {
        //should send 401
        res.sendStatus(401);
    }
    else {
        try {
            //get user's email using the user DAO
            const user = await userDAO.getUser(email);
            //checks if user actually exists
            if (!user) {
                //should send 401
                res.sendStatus(401);
            }
            else {
                //checks to see if a password has been entered or is empty
                if (!password || password === '') {
                    //should send 400
                    res.sendStatus(400);
                }
                else {
                    //hash incoming password, and compare it to the stored hash
                    bcrypt.compare(password, user.password, async (error, result) => {
                        //if an error pops up or no result comes up
                        //hashes don't match, entered password was wrong
                        if (error || !result) {
                            //should send 401
                            res.sendStatus(401);
                        }
                        //hashes match, entered password was correct
                        else {
                            //gives a token to that user
                            const token = await tokenDAO.getTokenForUserId(user._id);
                            //should send 200 and a token
                            res.status(200).send(token);
                        }
                    })
                }
            }
        }
        catch (e) {
            next(e);
        }
    }
    
});

//POST /password -
//If the user is logged in, store the incoming password using their userId
//uses the authenticateLogin middleware to authenticate the user; verify the user for their password
router.post("/password", authenticateLogin, async (req, res, next) => {
    //password is the password portion of the body
    const password = req.body.password;
    //check to see if password is entered or empty
    if (!password || password === '') {
        //should send 400; reject empty password
        res.sendStatus(400);
    }
    //else, there is a password entered
    else {
        try {
            //encrypts the user's entered password
            const encryptedPass = await bcrypt.hash(password, 10);
            //updates the user's password with the new encrypted password
            const updateUserPass = await userDAO.updateUserPassword(req.userId, encryptedPass);
            //should send 200 if password changed for user
            //should send 400 if password failed to change
            res.sendStatus(updateUserPass ? 200 : 400);
        }
        
        catch (e) {
            //something did not work properly, send 500
            res.status(500).send(e.message);
        }
    }
});

//POST /logout -
//If the user is logged in, invalidate their token so they can't use it again (remove it)
//uses the authenticateLogin middleware to authenticate the user; verify the user to remove their corresponding token
router.post("/logout", authenticateLogin, async (req, res, next) => {
    try {
        //token is given the credentials that authenticates the user
        const token = req.headers.authorization.split(' ')[1];
        //once user logs out, the token is removed from that user
        const logout = tokenDAO.removeToken(token);
        //should send 200, and removes the token from the user
        res.status(200).send(logout);
    }

    catch (e) {
        //something did not work properly, send 500
        res.status(500).send(e.message);
    }
});

//authenticate middleware
//allows us to identify the user making a request
//we are able to find out who they are: name, email, etc.
async function authenticateLogin(req, res, next) {
    //token is given the credentials that authenticates the user
    const token = req.headers.authorization;
    try {
        if (token) {
            //split the credentials
            const tokenString = token.split (' ')[1];
            //get the user id corresponding to their assigned token
            const userIdToken = await tokenDAO.getUserIdFromToken(tokenString);
            //if no user id from token
            if (!userIdToken) {
                //should send 401
                res.sendStatus(401);
            }
            //if a user id is returned
            else {
                //request user id takes the value of the user id from token
                req.userId = userIdToken.userId;
                next();
            }
        }
        else {
            //should send 401 and let user know that they are not logged in
            res.status(401).send("User not logged in");
        }
    }
    
    catch (e) {
        next(e);
    }
};

module.exports = router;