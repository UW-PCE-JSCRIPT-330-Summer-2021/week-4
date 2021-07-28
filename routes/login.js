const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

const bcrypt = require("bcrypt");

//POST /signup -
//should use bcrypt on the incoming password.
//Store user with their email and encrypted password
//handle conflicts when the email is already in use
router.post("/signup", async (req, res, next) => {
    const userInfo = req.body;
    const email = userInfo.email;
    const password = userInfo.password;

    //check if email is entered and/or if pass is entered
    if (!email) {
        res.status(400).send("No email entered)");
    }
    if (!password) {
        res.status(400).send("No password entered");
    }
    try {
        const user = await userDAO.getUser(email);
        if (user) {
            res.status(401).send("Already used email");
        }
        else {
            encryptedPass = await bcrypt.hash(userInfo.password, 10);
            newUser = ({ email, password: encryptedPass });
            const madeUser = await userDAO.createUser(newUser);
            res.json(madeUser);
        }
    }
    catch (e) {
        next(e);
    }
});

//POST / -
//find the user with the provided email. 
//Use bcrypt to compare stored password with the incoming password.
//If they match, generate a random token with uuid and return it to the user
router.post("/", async (req, rest, next) => {
    const userLogin = req.body;
    const email = userLogin.email;
    const password = userLogin.password;
    
    //check if login email exists
    if (!email) {
        res.status(401).send("Login does not exist");
    }
    else {
        try {
            const user = await userDAO.getUser(email);
            //checks if user actually exists
            if (!user) {
                res.status(401).send("User not found");
            }
            else {
                //checks to see if a password has been entered
                if (!password) {
                    res.status(400).send("Please enter a password");
                }
                else {
                    bcrypt.compare(password, user.password, async (error, results) => {
                        //if an error pops up or no result comes up
                        if (error || !results) {
                            res.status(401).send("Incorrect password");
                        }
                        else {
                            const token = await tokenDAO.getTokenForUserId(user._id);
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
router.post("/password", isLoggedIn, async (req, res, next) => {
    const password = req.body.password;
    if (!password || password === '') {
        res.status(400).send("Please enter a password");
    }
    else {
        try {
            const encryptedPass = await bcrypt.has(password, 10);
            const updateUserPass = await userDAO.updateUserPassword(req.userId, encryptedPass);
            res.sendStatus(updateUserPass ? 200 : 400);
        }
        
        catch (e) {
            next(e);
        }
    }
});

//POST /logout -
//If the user is logged in, invalidate their token so they can't use it again (remove it)
router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const logout = await tokenDAO.removeToken(token);
        if (logout) {
            res.status(200).send(logout);
        }
    }

    catch (e) {
        next (e);
    }
});

async function isLoggedIn(req, res, next) {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split (' ')[1];
            req.token = token;
            if (req.token) {
                const userId = await tokenDAO.getUserIdFromToken(req.token);
                if (userId) {
                    res.sendStatus(200);
                    next();
                }
            }
        }
    }
    
    catch (e) {
        next(e);
    }
};

module.exports = router;