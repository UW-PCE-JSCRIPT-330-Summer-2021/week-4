const { Router } = require("express");
const router = Router();

const bcrypt = require('bcrypt');

//Middleware files
const auth = require('../middleware/auth');
const errorHandler = require('../middleware/errors');

//DAOs
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');


router.post('/signup', async (req,res,next) => {

    const user = req.body;
    
    try {
        const existingUser = await userDAO.getByEmail(user.email);

        if(!user || JSON.stringify(user) === '{}') {
            throw new Error('User is required');
        } else if(!user.password || user.password.length === 0) {
            throw new Error("Password is required");
        } else if(existingUser) {
            throw new Error('User is a duplicate');
        } else {
            const hashPWD = await bcrypt.hash(user.password, 10);
            const newUser = await userDAO.create({email: user.email, password: hashPWD});
            res.status(200).send(newUser);
        }
    } catch(e) {
        next(e);
    }
});

router.post('/', async (req,res,next) => {
    
    const user = req.body;
    const existingUser = await userDAO.getByEmail(user.email);

    if(!existingUser) {
        next(new Error('User not found'));
    } else {

        try {
            if(!user.password || user.password.length === 0) {
                throw new Error("Password is required");
            }

            const pwdMatch = await bcrypt.compare(user.password, existingUser.password);

            if(pwdMatch) {
                const tokenStr = await tokenDAO.getTokenForUserEmail(user.email);
                res.status(200).send({token: tokenStr})
            } else {
                throw new Error('Passwords do not match');
            }
    
        } catch(e) {
                next(e);
            }
    }
});

router.post('/password', auth.isLoggedIn, async (req,res,next) => {
    const newPassword = req.body.password;

    try {
        if(!newPassword || newPassword.length === 0) {
            throw new Error("Password is required");
        }

        const user = await userDAO.getById(req.userId);
        const userEmail = user.email;

        const hashPWD = await bcrypt.hash(newPassword, 10);
        const tmpUser = {email: userEmail, password: hashPWD};

        const updatedUser = await userDAO.updatePassword(tmpUser);
        res.json(updatedUser);

    } catch(e) {
            next(e);
        }
});

router.post('/logout', auth.isLoggedIn, async (req,res,next) => {

    try {
        await tokenDAO.removeToken(req.token);
        res.sendStatus(200);
    } catch(e) {
            next(e);
        }    
});


router.use(errorHandler);


module.exports = router;