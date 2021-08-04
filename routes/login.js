const { Router } = require("express");
const router = Router();

const bCrypt = require('bcrypt');

/* const bCryptMid = require("/middleware/bCrypt") */

const userDAO = require('../daos/user');

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
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

/* router.use(async (req, res, next) => {
    const { userId } = req.params;  
    const user = await userDAO.getById(userId);
    if (!user) {
        res.status(404).send("User not found");
    } else {
        req.user = user;
        next();
    }
}); */


//create
router.post("/signup", async (req, res, next) => {
  const user = req.body;
  
  try {
    const salt = await bCrypt.genSalt(10);
    if (user.email && user.password) 
    {
      const hash = bCrypt.hash(user.password, salt);
      user.password = (await hash).toString();
      let newUser = await userDAO.create(user);
      res.json(newUser); 
    } else {
      let newUser = await userDAO.create(user);
      res.json(newUser); 
    }
  } catch(e) {
    
    next(e);
  }
  next();
});

router.use(async (err, req, res, next) => {  
  console.log(err);
  if (err.message.includes("Cast to ObjectId failed")) {   
      res.status(400).send('Invalid id provided');  
  } else if (err.message.includes("password: Password is required")) {   
      res.status(400).send('Password is required');
  } else if (err.message.includes("duplicate key")) {   
      res.status(409).send('Email already in use.');
  } else {    
      res.status(500).send('Something broke!')  
  }
  next(); 
});

// Read - single author
router.get("/:id", async (req, res, next) => {
  const author = await authorDAO.getById(req.params.id);
  if (author) {
    res.json(author);    
  } else {
    res.sendStatus(404);
  }
});
  
  // Read - all authors
  router.get("/", async (req, res, next) => {
    let { page, perPage } = req.query;
    page = page ? Number(page) : 0;
    perPage = perPage ? Number(perPage) : 10;
    const authors = await authorDAO.getAll(page, perPage);
    res.json(authors);
  });
  
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
  });
  
 
  
  
  
  module.exports = router;