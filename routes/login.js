const { Router } = require('express');
const router = Router();

const bcrypt = require('bcrypt');

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

router.post("/signup", async (req, res, next) => {
    try {
        const user = req.body;
        const email = user.email;
        const password = user.password;

        if (!email || !password || JSON.stringify(email) === '{}' || JSON.stringify(password) === '{}') {
            res.sendStatus(400);
        }

        const currentUser = await userDAO.getUser(email);

        if (currentUser) {
            res.sendStatus(409);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const hashedUser = await userDAO.createUser({ email, password: hashedPassword });
            res.json(hashedUser);
        }
    } catch (e) {
        next(e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const user = req.body;
        const email = user.email;
        const password = user.password;

        if (!email || !password || JSON.stringify(email) === '{}' || JSON.stringify(password) === '{}') {
            res.sendStatus(400);
        }

        const currentUser = await userDAO.getUser(email);

        if (!currentUser) {
            res.sendStatus(401);
        }

        const passwordMatching = await bcrypt.compare(password, currentUser.password);
        if (!passwordMatching) {
            res.sendStatus(401);
        } else {
            const userToken = await tokenDAO.getTokenForUserId(currentUser._id);
            res.json(userToken);
        }
    } catch (e) {
        next(e);
    }
});

router.post("/password", isLoggedIn, async (req, res, next) => {
    try {
        const password = req.body.password;

        if (!password || JSON.stringify(password) === '{}') {
            res.sendStatus(400);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newPassword = await userDAO.updateUserPassword(req.userId, hashedPassword);
            res.json(newPassword);
        }
    } catch (e) {
        res.sendStatus(401);
        next(e);
    }
});

router.post("/logout", isLoggedIn, async (req, res, next) => {
    try {
        const createdToken = req.headers.authorization.split(' ')[1];
        const removeToken = await tokenDAO.removeToken(createdToken);
        res.json(removeToken);
    } catch (e) {
        res.sendStatus(401);
        next (e);
    }
});

async function isLoggedIn(req, res, next) {    
    try {
        const userToken = req.headers.authorization;
        if (userToken) {
            const callbackToken = userToken.split(' ')[1];
            const userId = await tokenDAO.getUserIdFromToken(callbackToken);

            if (userId) {
                req.userId = userId.userId;
                next();
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        } 
    } catch (e) {
        next(e);
    }
};

module.exports = router;
