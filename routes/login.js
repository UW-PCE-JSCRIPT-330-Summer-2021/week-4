const { Router } = require("express");
const router = Router();
const userDAO = require('../daos/user');
const noteDAO = require('../daos/note');
const bcrypt = require('bcrypt');


// Signup: POST /login/signup
// POST /signup - should use bcrypt on the incoming password. 
// Store user with their email and encrypted password, 
// handle conflicts when the email is already in use.
router.post("/signup", async (req, res, next) => {
  try {
    const user = req.body;
    const email = user.email;
    const password = user.password;
    if (!email || !password || email === '' || password === '') {
      res.sendStatus(400);
    }
    const checkIfExisting = await userDAO.getUser(email);
    if (checkIfExisting) {
      res.sendStatus(409);
    } else {
      const savedHash = await bcrypt.hash(password, 10);
      const newUser = await userDAO.createUser({ email, password: savedHash });
      req.user = newUser;
      res.json(newUser);
    }
  } catch (e) {
    next(e);
  }
});

// Login: POST /login
// POST / - find the user with the provided email. 
// Use bcrypt to compare stored password with the incoming password. 
// If they match, generate a random token with uuid and return it to the user.
router.post("/", async (req, res, next) => {
  try {
    const user = req.body;
    const email = user.email;
    const password = user.password;
    if (!email || !password || email === '' || password === '') {
      res.sendStatus(400);
    }
    const checkIfExisting = await userDAO.getUser(email);
    if (!checkIfExisting) {
      res.sendStatus(401);
    }
    let match = await bcrypt.compare(password, checkIfExisting.password);
    if (!match) {
      res.sendStatus(401);
    } else {
      const token = await tokenDAO.getTokenForUserId(email);
      res.json(token);
    }
  } catch (e) {
    next(e);
  }
});

// Change Password POST /login/password
// POST /password - If the user is logged in, store the incoming password using their userId
router.post("/password", async (req, res, next) => {
  try {
    const password = req.body.password;
    if (!password || password === '') {
      return res.sendStatus(400);
    } else {
      const savedHash = await bcrypt.hash(password, 10);
      const updatedPassword = await userDAO.updateUserPassword(req.user._id, savedHash);
      res.sendStatus(200);
    }
  } catch (e) {
    res.sendStatus(401);
    next(e);
  }
});

// Logout: POST /login/logout
// POST /logout - If the user is logged in, invalidate their token so they can't use it again (remove it)
router.post("/logout", async (req, res, next) => {
  try {
    let token = req.tokenString;
    await tokenDAO.removeToken(token);
  } catch (e) {
    res.sendStatus(401);
    next (e);
  }
});

//isLoggedIn(req, res, next) - should check if the user 
//has a valid token and if so make req.userId = the userId 
//associated with that token. The token will be coming in 
//as a bearer token in the authorization header 
//(i.e. req.headers.authorization = 'Bearer 1234abcd') 
//and you will need to extract just the token text. 
//Any route that says "If the user is logged in" should 
//use this middleware function.
router.use(async function isLoggedIn(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
      const tokenString = bearerToken.split(' ')[1];
      const userId = await tokenDAO.getUserIdFromToken(tokenString);
      if (userId) {
        req.userId = userId.userId;
        next();
      }
    } else {
      res.sendStatus(401);
    } 
  } catch (e) {
    next(e);
  }
});

module.exports = router;