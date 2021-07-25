const { Router } = require("express");
const router = Router();

const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

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
    
            // bcrypt.compare(user.password, existingUser.password, async (bErr, bRes) => {
            //     if(bRes) {
            //         const tokenStr = await tokenDAO.getTokenForUserEmail(user.email);
            //         res.status(200).send({token: tokenStr});
            //     } else {
            //         next(new Error('Passwords do not match'));
            //     }    
            // });

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

        const userId = await tokenDAO.getUserFromToken(req.token);
        const user = await userDAO.getById(userId);
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
        res.sendStatus(200)
    } catch(e) {
            next(e);
        }    
});


router.use(function (err, req, res, next) {

    if(err.message.includes('duplicate')) {
        res.status(409).send(`User with email ${user.email} is already signed up`);
    } else if(err.message.includes('required')) {
        res.status(400).send(err.message);
    } else if(err.message.includes('User not found') || err.message.includes('Passwords do not match') || 
        err.message.includes('logged in') || err.message.includes('Bad Token')) {
        res.status(401).send(err.message);
    } else {
        res.status(500).send(err.message);
    }
})


module.exports = router;