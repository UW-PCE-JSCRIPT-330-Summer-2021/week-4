const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// Change password
router.post("/password", isLoggedIn, async (req, res, next) => {
  const password = req.body.password;
  if (!password || password === '') {
    res.status(400).send('Bad request - Missing new password');
  } else {
    try {
      const encryptedPW = await bcrypt.hash(password, 10);
      const success = await userDAO.updateUserPassword(req.userId, encryptedPW);
      res.sendStatus(success ? 200 : 400); 
    } catch(e) {
      res.status(500).send(e.message);
    }
  }
});

// Logout - Remove token
router.post("/logout", isLoggedIn, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const removed = tokenDAO.removeToken(token);
    res.status(200).send(removed);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

// Signup
router.post("/signup", async (req, res, next) => {
  const signupInfo = req.body;
  const email = signupInfo.email;
  const password = signupInfo.password;
  if (!password || !email) {
    res.status(400).send('Bad request - Missing signup info');
  } else if (email === '' || password === '') {
    res.status(400).send('Bad request - Empty email or password');
  } else {
    try {
      const user = await userDAO.getUser(email);
      if (user) {
        res.status(409).send('Conflict - Email already signed up');
      } else {
        encryptedPW = await bcrypt.hash(signupInfo.password, 10);
        newSignupInfo = ({ email, password: encryptedPW });
        const saveduser = await userDAO.createUser(newSignupInfo);
        res.json(saveduser); 
      }
    } catch(e) {
      next(e);
    }
  }
});

// Login
router.post("/", async (req, res, next) => {
  const loginInfo = req.body;
  const email = loginInfo.email;
  const password = loginInfo.password;
  if (!email || email === '') {
    res.status(401).send('Unauthorized - Missing login email');
  } else {
    try {
      const user = await userDAO.getUser(email);
      if (!user) {
        res.status(401).send('Unauthorized - User not found');
      } else {
        if (!password || password === '') {
          res.status(400).send('Bad request - No password provided');
        } else {
          bcrypt.compare(password, user.password, async (error, result) => {
            if (error || !result) {
              res.status(401).send('Unauthorized - Wrong password');
            } else {
              const token = await tokenDAO.getTokenForUserId(user._id);
              res.status(200).send(token);
            }
          });
        }
      }
    } catch(e) {
      next(e);
    }
  }
});

// Token check middleware
async function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send('Unauthorized - Not logged in');
  } else {
    const tokenString = token.split(' ')[1];
    const match = await tokenDAO.getUserIdFromToken(tokenString);
    if (!match) {
      res.status(401).send('Unauthorized - Incorrect login info');
    } else {
      req.userId = match.userId;
      next();
    }
  }
}

module.exports = router;