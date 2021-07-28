const { Router } = require('express');
const router = Router({ mergeParams: true });
const bcrypt = require('bcrypt');
const { isLoggedIn, secret } = require('../middleware/authentication');
const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');
const jwt = require('jsonwebtoken');

// Create - user 
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body; 
  if (!email || email === '') {
    res.status(400).send('Email is required');
  } 
  else if (!password || password === '') {
    res.status(400).send('Password is required');
    return;
  } 
    try {
      const user = await userDAO.getUser(email);
      if (user) {
        res.status(409).send('Email already associated with an account');
      } 
      else {
      const hashedPw = await bcrypt.hash(password, 10);
      const savedUser = await userDAO.createUser({ email, password: hashedPw });
      res.status(200).send(savedUser); 
      }
    } catch (e) {
        if (e.message.includes('validation')) {
          res.status(400).send('Password is not valid');
        }
        else {
          res.status(500).send(e.message);
        }
    }
});

// Create - user token 
router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
        res.status(400).send('Email required');
        return;
    }
    if (!password) {
        res.status(400).send("Password required");
        return;
    }
    const user = await userDAO.getUser(email);
    if (!user || user.length === 0) {
        res.sendStatus(401);
        return;
    }

    bcrypt.compare(password, user.password, async function(error, result) {
        if (error) {
            res.sendStatus(401);
        }
        if (result) {
            const savedToken = { tokenString: await tokenDAO.getTokenForUserId(user._id.toHexString()) };
            const createdToken = jwt.sign(savedToken, secret);
            res.status(200).send({token: createdToken});
        }
    });
  }  catch(e) {
    res.status(500).send(e.message);
  }
});

router.use(async (req, res, next) => {
  isLoggedIn(req, res, next);
});

// Update password
router.post('/password', async (req, res, next) => {
  try {
    const password = req.body.passowrd;
    if (!password || password.length === 0) {
      res.status(400).send('Password is required');
    }
    const encryptedPW = await bcrypt.hash(password, 10);
    await userDAO.updateUserPassword(req.userId, encryptedPW)
    res.status(200).send('Password updated');
  } catch (e) {
    res.sendStatus(500);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    tokenDAO.removeToken(req.tokenString);
    res.status(200).send('Successfully logged out')
  }
  catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
