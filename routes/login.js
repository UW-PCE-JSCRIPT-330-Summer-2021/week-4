const { Router } = require("express")
const router = Router();
const bcrypt = require("bcrypt");
const { isLoggedIn, SECRET_TOKEN } = require('../middleware/auth');

const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');

const jwt = require('jsonwebtoken');

router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email.length === 0) {
        res.sendStatus(400);
        return;
    }
    if (!password || password.length === 0) {
        res.sendStatus(400);
        return;
    }
    try {
        const encryptedPw = await bcrypt.hash(password, 10);
        const createdUser = await userDAO.createUser({email, password: encryptedPw});
        res.status(200).send(createdUser);
    }
    catch(e) {
        if (e.message.includes("validation")) {
            res.status(400).send('User info was invalid')
        } else if (e.message.includes("duplicate")) {
            res.status(409).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email) {
            res.status(400).send("No email provided");
            return;
        }
        if (!password) {
            res.status(400).send("No password provided");
            return;
        }
        const foundUser = await userDAO.getUser(email);
        if (!foundUser || foundUser.length === 0) {
            res.sendStatus(401);
            return;
        }

        bcrypt.compare(password, foundUser.password, async function(bcryptErr, bcryptRes) {
            if (bcryptErr) {
                res.sendStatus(401);
            }
            if (bcryptRes) {
                
                const tokenToSave = {
                    tokenString: await tokenDAO.getTokenForUserId(foundUser._id.toHexString())
                }
                const createdToken = jwt.sign(tokenToSave, SECRET_TOKEN);
                res.status(200).send({token: createdToken});
            }
            else {
                res.sendStatus(401);
            }
        });
    }
    catch(e) {
        res.status(500).send(e.message);
    }
});

router.use(isLoggedIn);

router.post("/password", async (req, res, next) => {
    try {
        const password = req.body.password;
        if (!password || password.length < 1) {
            res.status(400).send("No password provided");
            return;
        }
        const encryptedPw = await bcrypt.hash(password, 10);
        await userDAO.updateUserPassword(req.userId, encryptedPw);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
})

router.post("/logout", async (req, res, next) => {
    try {
        tokenDAO.removeToken(req.tokenString);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;
