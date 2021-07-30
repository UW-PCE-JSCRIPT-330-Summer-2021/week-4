const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const isLoggedIn = require('../middleware/auth');

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!password || password === '' || !email || email === '') {
    return res.sendStatus(400);
  }

  const user = await userDAO.getUser(email);
  if (user) {
    return res.sendStatus(409);
  };

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userDAO.createUser({ email, password: hashedPassword });
    if (newUser) {
      return res.status(200).send(newUser.passowrd);
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!password || password === '' || !email || email === '') {
    return res.sendStatus(400);
  }

  const user = await userDAO.getUser(email);
  // console.log('user', user);
  if (!user) {
    return res.sendStatus(401);
  };
  try {
    const { _id: userId } = user;
    // console.log('userId', userId);

    bcrypt.compare(password, user.password, async (error, result) => {
      if (error || !result) {
        return res.sendStatus(401);
      } else {
        const token = await tokenDAO.createToken(userId);
        return res.status(200).send(token);
      }
    })
  } catch (e) {
    res.status(500).send(e.message);
    return
  }
});

router.post("/logout", isLoggedIn, async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    await tokenDAO.removeToken(token);
    return res.sendStatus(200)
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.post("/password", isLoggedIn, async (req, res) => {
  const password = req.body.password;
  if (!password || password === '') {
    return res.sendStatus(400);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userDAO.updateUserPassword(req.userId, hashedPassword);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;