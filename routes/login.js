const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

//MIDDLEWARE

//isLoggedIn(req, res, next) - should check if the user has a valid
//token and if so make req.userId = the userId associated with that token.
//The token will be coming in as a bearer token in the authorization header
//(i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need to
//extract just the token text.
//Any route that says "If the user is logged in" should use this
//middleware function
const isLoggedIn = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ')[1];
        req.token = bearer;
        if (req.token) {
            const userId = await tokenDAO.getUserIdFromToken(req.token);
            if (userId) {
                req.userId = userId;
                next();
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
};

//router.use(error, req, res, next) - can be used to handle errors
//where the provided note id is not a valid ObjectId.
//This can be done without middleware though.
router.use(function (error, req, res, next) {
    if (error.message.includes("duplicate key")) {
        res.status(409).send('Account already exists with this email.')
    } else {
        res.sendStatus(500)
    }
});

//LOGIN ROUTES

//Signup: POST /login/signup - should use bcrypt on the incoming password.
//Store user with their email and encrypted password, handle conflicts when
//the email is already in use.
router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email === "") {
        res.sendStatus(400)
    } else if (!password || password === "") {
        res.sendStatus(400)
    } else {
        try {
            //newSignUp checks for if there's an existing email already in use
            //calls getUser from userDAO since getUser should store a user record using their email
            //returns 409 conflict with a repeat sign up
            const newSignUp = await userDAO.getUser(email);
            if (newSignUp) {
                res.sendStatus(409)
            } else {
                //saltRounds provides number of rounds
                //genSalts asynchronously generates a salt with default of 10
                //saltRounds = 10
                const saltRounds = await bcrypt.genSalt(10);

                //hash is to store an encrypted password using password parameters from const { email, password }
                //and saltRounds as parameter
                const hash = await bcrypt.hash(password, saltRounds);
                const checkUser = await userDAO.getUser(hash);
                res.json(checkUser)
            }
        } catch (e) {
            next (e);
        }
    }
});

//Login: POST /login - find the user with the provided email.
//Use bcrypt to compare stored password with the incoming password.
//If they match, generate a random token with uuid and return it to the user.
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userDAO.getUser(email)
    if (!user) {
        res.status(401).send('User does not exist.')
    } else {
        if (!password || password === "") {
            res.status(400).send('Password required.');
        } else {
            const user = await userDAO.getUser(email);
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401).send('Wrong password.');
            } else {
                try {
                    const userToken = await userDAO.assignUserToken(user._id)
                    res.json(userToken)
                } catch (e) {
                    next (e);
                }
            }
        }
    }
});

//Logout: POST /login/logout - if the user is logged in, invalidate their
//token so they can't use it again (remove it).
router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        await tokenDAO.removeToken(req.token);
        res.status(200).send('Token deleted.');
    } catch (e) {
        next (e);
    }
});

//Change Password POST /login/password - if the user is logged in, store
//the incoming password using their userId.
router.post("/password", isLoggedIn, async (req, res, next) => {
    const password = req.body.password;
    if (!password || password === '') {
        res.sendStatus(400);
    } else {
        try {
            const bcryptPassword = await bcrypt.hash(password, 10);
            const pass = await userDAO.updateUserPassword(req.userId, bcryptPassword);
            res.sendStatus(pass ? 200 : 400);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

module.exports = router;