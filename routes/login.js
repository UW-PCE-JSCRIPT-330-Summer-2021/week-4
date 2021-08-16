const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const { isLoggedIn } = require('../middleware/authentication');

// Signup Route //
router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !email === '' || !password || !password === '') {
        res.status(400).send('Email and/or password required');
    } else {
        try {
            const user = await userDAO.getUserById(email);
            if (user) {
                res.status(409).send('Email already exists');
            } else { 
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await userDAO.createUser({ email, password: hashedPassword });
                res.json(newUser);
            }
        } catch (e) {
        }
    }
});

// Login Route //
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email === '' || !password || password === '') {
        res.status(400).send('Email and/or password required');
    } else {
        try {
            const user = await userDAO.getUserById(email);
            if (!user) {
                res.sendStatus(401);
                } else {
                    const { _id: userId } = user;
                        bcrypt.compare(password, user.password, async (error, result) => {
                            if (error || !result) {
                                res.status(401).send('Password does not match');
                            } else {
                                const token = await tokenDAO.getTokenForUserId(userId);
                                res.status(200).send(token);
                            }
                        })
                    }
            } catch (e) {
            }
        }
});

// // Change Password Route //
router.post("/password", isLoggedIn, async (req, res, next) => {
    const password = req.body.password;
    const user = await tokenDAO.getUserFromToken(req.token);
    // console.log(`user: ${JSON.stringify(userId, null, 2)}, pw: ${JSON.stringify(password, null, 2)}`);
    if (!password || password === '') {
    res.sendStatus(400);
    } try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newPassword = await userDAO.updateUserPassword(user, hashedPassword);
        return res.json(newPassword);
        } catch (e) {
            res.sendStatus(401);
        } 
});

// Logout Route //
router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const removeToken = await tokenDAO.removeToken(token);
        res.json(removeToken);
    } catch (e) {
    }
});

// Signup: POST /login/signup
// Login: POST /login
// Logout: POST /login/logout
// Change Password POST /login/password

module.exports = router;