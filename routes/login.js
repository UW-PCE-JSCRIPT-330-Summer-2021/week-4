const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// Authentication and Token Validation //
async function isLoggedIn(req, res, next) {
    if (!req.session.user_id) {
        res.send('Not logged in');
    } else {
        next(e);
    }
};

// Error Handling //
async function errorCatch(err, req, res, next) => {
    
}

// Signup Route //
router.post("/signup", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send('Email and/or password required');
    } else if (email === '' || password === '') {
        res. status(400).send('Empty email and/or password')
    } else {
        try {
            const user = await userDAO.getUser(email);
            if (user) {
                res.status(409).send('Email already exists');
            } else { 
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await userDAO.createUser({ email, password: hashedPassword });
                res.json(newUser);
            }} catch (e) {
                next(e);
            }
        }
});

// Login Route //
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email === '') {
        res.status(401).send('Missing email');
    } else {
        try {
            const user = await userDAO.getUser(email);
            if (!user) {
                res.status(401).send('Missing user');
            } else {
                if (!password || password === '') {
                    res.status(400).send('Missing password');
                } else {
                        bcrypt.compare(password, user.password, async (error, result) => {
                            if (error || !result) {
                                res.status(401).send('Password does not match');
                            } else {
                                const token = await tokenDAO.getTokenForUserId(user._id);
                                res.status(200).send(token);
                            }
                        })
                    }
                }
            } catch (e) {
                next(e)
            }
        }
});

// Logout Route //
router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        let token = req.headers.autorization.split(' ');
        const removeToken = await tokenDAO.removeToken(token);
        res.json(removeToken);
    } catch (e) {
        next(e)
    }
});

// // Change Password Route //
router.post("/password", isLoggedIn, async (req, res, next) => {
    try {
        const password = req.body.password;
        if (!password || password === '') {
        res.status(400);
        } else {
            const hashedPassword = bcrypt.hash(password, 10);
            const newPassword = await userDAO.updateUserPassword(req.user._id, hashedPassword);
            res.status(200);
        }
    } catch (e) {
        next(e)
    }
});



// Signup: POST /login/signup
// Login: POST /login
// Logout: POST /login/logout
// Change Password POST /login/password

module.exports = router;