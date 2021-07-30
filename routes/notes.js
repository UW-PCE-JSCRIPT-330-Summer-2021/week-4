const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

//POST / -
//If the user is logged in, it should store the incoming note along with their userId
////uses the authenticateLogin middleware to authenticate the user; to create notes depending on user
router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        //creates notes using the note DAO
        const notes = await noteDAO.createNote(req.userId, req.body);
        //should return 200 and send the notes created
        res.status(200).send(notes);
    }

    catch (e) {
        next(e);
    }
});

//GET / -
//If the user is logged in, it should get all notes for their userId
//uses the authenticateLogin middleware to authenticate the user; to get all notes depending on user
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        //gets all notes depending on user id using the note DAO
        const notes = await noteDAO.getUserNotes(req.userId);
        //should return 200 and send the notes gotten from user depending on their user id
        res.status(200).send(notes);
    }

    catch (e) {
        next(e);
    }
});

//GET /:id -
//If the user is logged in, it should get the note with the provided id and that has their userId
//uses the authenticateLogin middleware to authenticate the user; to get specific not depending on user
router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        //gets specific note depending on user id and note id using the note DAO
        const notes = await noteDAO.getNote(req.userId, req.params.id);
        //if notes aren't gotten
        if (!notes) {
            //should return 404 and message saying note not found
            res.status(404).send("Note not found");
        }
        //else, notes are gotten
        else {
            //should return 200 and send the notes gotten
            res.status(200).send(notes);
        }
    }
    catch (e) {
        //if an error message of invalid pops up, then error number is 400
        if(e.message.includes("invalid")) {
            e.status = 400;
        }
        next(e);
    }
});

//authenticate middleware
//allows us to identify the user making a request
//we are able to find out who they are: name, email, etc.
async function isLoggedIn(req, res, next) {
    //token is given the credentials that authenticates the user
    const token = req.headers.authorization;
    try {
        if (token) {
            //split the credentials
            const tokenString = token.split (' ')[1];
            //get the user id corresponding to their assigned token
            const userIdToken = await tokenDAO.getUserIdFromToken(tokenString);
            //if no user id from token
            if (!userIdToken) {
                //should send 401
                res.sendStatus(401);
            }
            //if a user id is returned
            else {
                //request user id takes the value of the user id from token
                req.userId = userIdToken.userId;
                next();
            }
        }
        else {
            //should send 401 and let user know that they are not logged in
            res.status(401).send("User not logged in");
        }
    }
    
    catch (e) {
        next(e);
    }
};

//error handling middleware
//put it last
//used to handle errors where the provided note id is not a valid objectId
router.use(function (err, req, res, next) {
    try {
        //if error is that there is no valid objectId
        if (err.message.includes("Cast to ObjectId failed")) {
            //should send 400
            res.sendStatus(400);
        }
        else {
            //should send 500 and the error message
            res.status(500).send(err.message);
        }
    }
    catch (e) {
        next(e);
    }

});

module.exports = router;