const { Router } = require("express");
const router = Router();


// const jwt = require('jsonwebtoken');
// const secret = 'KEQZOjws7PPb2pPoFIIn';


const bCrypt = require('bcrypt');

const userDAO = require('../daos/user');
// const user = require("../models/user");

const tokenDAO = require('../daos/token');
// const token = require("../models/token");

const errorReport = require("../middleware/ErrorReport");
const isLoggedIn = require("../middleware/IsLoggedIn");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    req.salt = await bCrypt.genSalt(10);
    console.log(req.salt);
    next();
});


//create
router.post("/signup", async (req, res, next) => {
  const user = req.body;
  
  try {
    if (user.email && user.password) 
    {
      const hash = bCrypt.hash(user.password, req.salt);
      user.password = (await hash).toString();
    }
    let newUser = await userDAO.create(user);
    res.json(newUser); 
  } catch(e) {
    
    next(e);
  }
  next();
});
  
router.use(async (req, res, next) => {
  const user = req.body;
  
  try {
    if (user) 
    {
      const newUser = await userDAO.getByLogin(user.email);
      req.user = newUser;
    }
    next(); 
  } catch(e) {
    
    next(e);
  }
});


// Login using email and password  
  router.post("/", async (req, res, next) => {
    try {
      if (!req.body.password){
        throw new Error('Password is required');
      }
      if (!req.user.password){
        throw new Error('Password is required');
      }
      if (!req.user){
        throw new Error('User not found');
      }

      let compareSuccess = await bCrypt.compare(req.body.password, req.user.password);
      if (!compareSuccess) {
        console.log('Password match failed.')
        throw new Error('Password match failed');
      }

      // user record in req.user
      // const data  = { userId: req.user._id, email: req.user.email }
      // let token = jwt.sign(data, secret);
      // res.json({token});
      const newToken = await tokenDAO.getTokenForUserId(req.user._id);
      console.log(newToken);
      if (newToken) {
        res.json(newToken);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  });

  router.use(isLoggedIn);
  
  //Password change
  router.post("/password", async (req, res, next) => {
    try {
      if (!req.body.password){
        throw new Error('Password is required');
      }
      if (!req.tokenIsValid) { 
        throw new Error('Token is Invalid');
      }


        const hash = bCrypt.hash(req.body.password, req.salt);
        const newPasswordHash = (await hash).toString();
        const data = { password: newPasswordHash}

        // await userDAO.updateById(queryUser._id, data);  
        const isUpdated = await userDAO.updateById(req.user._id, data);  
        if (!isUpdated) {
          throw new Error("Password not Changed");
        }

        // Return a new token.  
        // let token = jwt.sign(req.payload, secret);
        // res.json({token});
        // let newToken = await tokenDAO.getTokenForUserId(data);
        // res.json({newToken});

        res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  });
  
  router.post("/logout", async (req, res, next) => {
    try {
      if (!req.tokenIsValid) { 
        throw new Error('Token is Invalid');
      }
      const removed = await tokenDAO.removeToken({ token: req.token, userId: req.user._id});
      console.log(`removed = ${removed}`);
      // console.log(`removed.deleteCount = ${removed.deleteCount}`);
      if (removed && removed.deletedCount === 1) {
        res.sendStatus(200);
      } else {
        throw new Error('Not removed');
      }
    } catch (e) {
      next(e);
    }
  });

  router.use(errorReport); 
  
  
  module.exports = router;