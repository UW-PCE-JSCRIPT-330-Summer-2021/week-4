const { Router } = require('express');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

const bcrypt = require('bcrypt');

const errorHandler = require('../middleware/errorHandler');

router.post("/signup", async (req, res, next) => {
    try {
        const currentUser = await userDAO.getByEmail(req.body.email);

        if (!req.body || JSON.stringify(req.body) === '{}') {
            throw new Error('The user is required');
        } else if (!req.body.password || req.body.password.length === 0) {
            throw new Error('User\'s password is required');
        } else if (currentUser) {
            throw new Error('This user is already exist');
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 7);
            const hashedUser = await userDAO.createUser({ email: req.body.email, password: hashedPassword });
            res.json(hashedUser);
        }
    } catch (e) {
        next (e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const currentUser = await userDAO.getByEmail(req.body.email);

        if (!currentUser) {
            throw new Error('The user is not found');
        } else {
            if (!req.body.password || req.body.password.length === 0) {
                throw new Error('User\'s password is required');
            }
            const passwordMatching = await bcrypt.compare(req.body.password, currentUser.password);
            if (passwordMatching) {
                const userToken = await tokenDAO.getTokenForUserId(req.body.email);
                res.json({ tokenString: userToken });
            } else {
                throw new Error('Passwords do not match');
            }
        } 
    } catch (e) {
        next (e);
    }
});

router.post('/password', async (req, res, next) => {
    try {
        if (!req.body.password || req.body.password.length === 0) {
            throw new Error('Password is required');
        }

        const currentUser = await userDAO.getById(req.userId);
        const hashedPassword = await bcrypt.hash(req.body.password, 7);
        const temporaryUser = { email: currentUser.email, password: hashedPassword };
        const hashedUser = await userDAO.updateUserPassword(temporaryUser);
        res.json(hashedUser); 


    } catch (e) {
        next (e);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        await tokenDAO.removeToken(req.token);
        res.status(200);
    } catch (e) {
        next (e);
    }
});

router.use(errorHandler);

module.exports = router;
