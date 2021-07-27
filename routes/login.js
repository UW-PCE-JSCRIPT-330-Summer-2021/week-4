const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// Signup Route //
router.post("/signup", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send('Email and Password required');
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

});

// Logout Route //
router.post("/logout", async (req, res, next) => {

});

// Change Password Route //
router.post("/password", async (req, res, next) => {

});



// Signup: POST /login/signup
// Login: POST /login
// Logout: POST /login/logout
// Change Password POST /login/password