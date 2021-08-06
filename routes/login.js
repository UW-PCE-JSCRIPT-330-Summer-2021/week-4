const { Router } = require("express");
const router = Router();

const jwt = require('jsonwebtoken');
const secret = 'KEQZOjws7PPb2pPoFIIn';


const bCrypt = require('bcrypt');

/* const bCryptMid = require("/middleware/bCrypt") */

const userDAO = require('../daos/user');
const user = require("../models/user");
const token = require("../models/token");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    req.salt = await bCrypt.genSalt(10);
    console.log(req.salt);
    next();
  });
    
/* hash = async (password) => {
  return bcrypt.hash(password, 7).then(logHash);
} */

/* router.use(async (req, res, next) => {
    const { userId } = req.params;
    const user = await userDAO.getById(userId);
    if (!user) {    
        res.status(404).send("User not found");
    } else {
        next();
    }
}); */



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
      //const hash = bCrypt.hash(user.password, req.salt);
      //const password = (await hash).toString();
      const newUser = await userDAO.getByLogin(user.email);

        req.user = newUser;
        next(); 
    }
  } catch(e) {
    
    next(e);
  }
});


/* router.use(async (req, res, next) => {
  try {
    const { userId } = req.params;  
    const user = await userDAO.getById(userId);
     if (!user) {
      res.status(404).send("User not found");
    } else {
      req.user = user;
      next();
    } 
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error('user not found');
    }
    
  } catch (e) {
    next(e);
  }
});
 */


/* // Read - single author
router.get("/:id", async (req, res, next) => {
  const author = await authorDAO.getById(req.params.id);
  if (author) {
    res.json(author);    
  } else {
    res.sendStatus(404);
  }
});*/
  
  // Read - all authors
  router.post("/", async (req, res, next) => {
    try {
      if (!req.body.password){
        throw new Error('Password is required');
      }

      let compareSuccess = await bCrypt.compare(req.body.password, req.user.password);
      console.log("I'm here", compareSuccess);
      if (!compareSuccess) {
        console.log('Password match failed.')
        throw new Error('Password match failed');
      }

      // user record in req.user
      const data  = { userId: req.user._id, email: req.user.email }
      let token = jwt.sign(data, secret);
      res.json({token});
    } catch (e) {
      next(e);
    }
  });/*
  
  // Update
  router.put("/:id", async (req, res, next) => {
    const authorId = req.params.id;
    const author = req.body;
    if (!author || JSON.stringify(author) === '{}' ) {
      res.status(400).send('author is required"');
    } else {
      try {
        const success = await authorDAO.updateById(authorId, author);
        res.sendStatus(success ? 200 : 400); 
      } catch(e) {
        if (e instanceof authorDAO.BadDataError) {
          res.status(400).send(e.message);
        } else {
          res.status(500).send(e.message);
        }
      }
    }
  });
  
  // Delete
  router.delete("/:id", async (req, res, next) => {
    const authorId = req.params.id;
    try {
      const success = await authorDAO.deleteById(authorId);
      res.sendStatus(success ? 200 : 400);
    } catch(e) {
      res.status(500).send(e.message);
    }
  }); */
  
  router.use(async (err, req, res, next) => {  
    console.log(err);
    if (err.message.includes("Cast to ObjectId failed")) {   
        res.status(400).send('Invalid id provided');  
    } else if (err.message.includes("Password is required") || err.message.includes("data and salt arguments required") || err.message.includes("password is not defined")) {   
        res.status(400).send('Password is required');
    } else if (err.message.includes("duplicate key")) {   
        res.status(409).send('Email already in use.');
    } else if (err.message.includes("Password match failed")) {   
        res.status(401).send("Password doesn't match");
    } else {    
        res.status(500).send('Something broke!')  
    }
    next(); 
  });
  
  
  
  module.exports = router;