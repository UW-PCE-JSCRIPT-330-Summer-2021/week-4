const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();

const { isLoggedIn } = require("../middleware/auth")

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');


// router.get("/", async (req, res, next) => {
//   try {
//     const users = await userDAO.getAll();
//     res.json(users);
//   } catch (e) {
//     next(e);
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}') {
      res.status(400).send('user is required');
    } else {
      const savedUser = await userDAO.getUser(user.email);
      const checkMatch = await bcrypt.compare(user.password, savedUser.password);
      if (!checkMatch) {
        res.status(404).send('Unauthorized - Wrong password');
      } else {
        const token = await tokenDAO.getTokenForUserId(savedUser._id);
        res.status(200).send(token);
      }
    }
  } catch (e) {
    if (e.message.includes('validation failed:')) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send('Unexpected Server Error');
    }
  }
});


router.post("/signup", async (req, res, next) => {
  try {
    //bcrypt password
    const user = req.body;
    const userEmail = user.email;
    const userPassword = user.password;
    if (!user || JSON.stringify(user) === '{}') {
      res.status(400).send('user is required');
    } else {
      const encryptedPassword = await bcrypt.hash(userPassword, 10);
      const signupInfo = ({ email: userEmail, password: encryptedPassword });
      const savedUser = await userDAO.createUser(signupInfo);
      res.json(savedUser);
    }
  } catch (e) {
    if (e.message.includes('validation failed:')) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send('Unexpected Server Error');
    }
  }
});

router.use(isLoggedIn);

router.post("/logout", async (req, res, next) => {
  try {
    const user = req.body;
    if (!user || JSON.stringify(user) === '{}') {
      res.status(400).send('user is required');
    } else {
      const savedUser = await userDAO.createUser(user);
      res.json(savedUser);
    }
  } catch (e) {
    if (e.message.includes('validation failed:')) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send('Unexpected Server Error');
    }
  }
});

router.post("/password", async (req, res, next) => {
  try {
    const password = req.body.password;
    const userId =  req.userId;
    if (!password || password.length < 1) {
      res.status(400).send('user is required');
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const updated = await userDAO.updateUserPassword(userId, encryptedPassword);
      res.json(updated);
    }
  } catch (e) {
    if (e.message.includes('validation failed:')) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send('Unexpected Server Error');
    }
  }
});

module.exports = router;
