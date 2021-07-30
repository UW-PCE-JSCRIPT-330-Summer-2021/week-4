const { Router } = require('express');
const router = Router({ mergeParams: true });

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'secret_master_keyword';
const isLoggedIn = require('../middleware/logging');

router.post('/signup', async (req, res, next) => {
  const user = req.body;
  if (!user) {
    res.status(400).send('User not found');
    return;
  }
  if (!user.email) {
    res.status(400).send('Email not found');
    return;
  }
  if (user.email.trim() === '') {
    res.status(400).send('Empty email');
    return;
  }
  if (!user.password) {
    res.status(400).send('Password not found');
    return;
  }
  if (user.password.trim() === '') {
    res.status(400).send('Empty Password');
    return;
  }
  const email = user.email.trim();

  const checkUser = await userDAO.getUser(email);

  if (checkUser) {
    res.status(409).send('User is already exists');
    return;
  }

  const textPassword = user.password.trim();
  let savedHash = await bcrypt.hash(textPassword, 10);

  const postedUser = await userDAO.createUser({
    email: email,
    password: savedHash,
  });
  req.user = postedUser;
  res.status(200).send('Ok');
});

// find the user with the provided email.
router.post('/', async (req, res, next) => {
  let inUser = req.body;
  if (!inUser) {
    res.status(401).send('User not found');
    return;
  }

  let email = inUser.email;
  let userFromDB = await userDAO.getUser(email);

  if (!userFromDB) {
    res.status(401).send('User not found');
    return;
  }
  let inpassword = inUser.password;
  if (!inpassword) {
    res.status(400).send('Password not found');
    return;
  }
  inpassword = inpassword.trim();
  if (inpassword === '') {
    res.status(400).send('Password empty');
    return;
  }

  let result = await bcrypt.compare(inpassword, userFromDB.password);
  if (!result) {
    res.status(401).send('Passwords not match');
    return;
  }

  let token = await jwt.sign(userFromDB, secret);
  let newToken = await tokenDAO.create(token, userFromDB._id);
  if (newToken) {
    res.json(newToken);
  }
});

router.use(async (req, res, next) => {
  isLoggedIn(req, res, next);
});

router.post('/password', async (req, res, next) => {
  let password = req.body.password;
  if (!password) {
    res.status(400).send('password is required');
    return;
  }

  password = password.trim();

  if (password === '') {
    res.status(400).send('password is required');
    return;
  }
  let savedHash = await bcrypt.hash(password, 10);
  const postedUser = await userDAO.updateUserPassword(req.user._id, savedHash);
  res.status(200).send('Ok');
});

router.post('/logout', async (req, res, next) => {
  let token = req.token;
  tokenDAO.removeToken(token);
  res.status(200).send('user is required');
});

module.exports = router;
