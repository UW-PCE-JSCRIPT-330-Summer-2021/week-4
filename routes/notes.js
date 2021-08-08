const { Router } = require("express");
const router = Router();

// const jwt = require('jsonwebtoken');
// const secret = 'KEQZOjws7PPb2pPoFIIn';

const notesDAO = require('../daos/note');
const note = require("../models/note");

const isLoggedIn = require("../middleware/IsLoggedIn");
const errorReport = require("../middleware/ErrorReport");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    next();
  });

router.use(isLoggedIn);

// router.use(async (req, res, next) => {
// try {
//     const AuthHeader = req.headers.authorization;
//     if (AuthHeader) {
//         if (typeof(AuthHeader !== 'undefined')){
//         const auth = AuthHeader.split(' ');
//         req.token = auth[1];
//         }

//         console.log('req.token = ' + req.token)
//         req.tokenIsValid = jwt.verify(req.token, secret);
//         if (req.tokenIsValid){
//         const decoded = jwt.decode(req.token);

//         req.payload = decoded;
//         }
//     }

//     if (!req.token){
//         throw new Error('Token is Invalid');
//     }
//     next();
// } catch (e) {
//     next(e);
// }
// });


router.post("/", async (req, res, next) => {
    const reqBody = req.body;
    // const reqPayload = req.payload;
    
    try {
        
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        console.log(reqBody);
        // console.log(reqPayload);
        if (reqBody && req.tokenIsValid){
            // const notedata = {text: reqBody.text, userId: reqPayload.userId};            
            const notedata = {text: reqBody.text, userId: req.user._id};
            let newNote = await notesDAO.create(notedata);
            res.json(newNote); 
        } else {
            next();
        }
    } catch(e) {      
      next(e);
    }
  });

 router.get("/", async (req, res, next) => {
    try {
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        // const notes = await notesDAO.getByUserId(req.payload.userId);
        const notes = await notesDAO.getByUserId(req.user._id);
        res.json(notes);
    } catch(e) {      
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        const noteId = req.params.id;
        // const note = await notesDAO.getById(noteId, req.payload.userId);
        const note = await notesDAO.getById(noteId, req.user._id);
        if (!note) {
            throw new Error("Invalid note ID");
        }
        res.json(note);
    } catch(e) {      
        next(e);
    }
});

router.use(errorReport);


  
module.exports = router;
  
  
