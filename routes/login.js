const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

//MIDDLEWARE

//To Validate Token
const isLoggedIn = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        if (req.token) {
            const userId = await tokenDAO.getUserIdFromToken(req.token);
            if (userId) {
                next ();
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

//Error Handling
router.use(function (error, req, res, next) {
    if (error.message.includes("duplicate key")) {
        res.status(409).send('Account already exists with this email.')
    } else {
        res.sendStatus(500)
    }
});

//LOGIN ROUTES

//Signup: POST /login/signup
router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || password === "") {
        res.status(400).send('Email and password are required.')
    } else {
        try {
            const newUser = await userDAO.signup(email, password);
            res.json(newUser);
        } catch (e) {
            next (e);
        }
    }
});

//Login: POST /login
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

//Logout: POST /login/logout
router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        await tokenDAO.removeToken(req.token);
        res.status(200).send('Token deleted.');
    } catch (e) {
        next (e);
    }
});

//Change Password POST /login/password
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