const { Router } = require("express");
const mongoose = require('mongoose');
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');

//MIDDLEWARE

//isLoggedIn(req, res, next) - should check if the user has a valid
//token and if so make req.userId = the userId associated with that token.
//The token will be coming in as a bearer token in the authorization header
//(i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need to
//extract just the token text.
//Any route that says "If the user is logged in" should use this
//middleware function
const isLoggedIn = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ')[1];
        req.token = bearer;
        if (req.token) {
            const userId = await tokenDAO.getUserIdFromToken(req.token);
            if (userId) {
                req.userId = userId;
                next();
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
};

router.use(isLoggedIn);

//NOTES ROUTES (requires authentication)

//Create: POST /notes - if the user is logged in, it should
//store the incoming note along with their userId
router.post("/", async (req, res, next) => {
    const userId = req.userId;
    const { text } = req.body;
    if (!userId) {
        res.status(401).send(e.message);
    } else {
        try {
            const newNote = await noteDAO.createNote(userId, text);
            res.json(newNote);
        } catch (e) {
            res.status(400).send(e.message);
        }
    }
});

// Get all of my notes: GET /notes - if the user is logged in, it should
//get all notes for their userId
router.get("/", async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).send(e.message);
    } else {
        const notes = await noteDAO.getUserNotes(userId);
        if (notes) {
            res.json(notes);
        } else {
            res.status(404).send('Not found');
        };
    }
});

// Get a single note: GET /notes/:id - if the user is logged in, it should
//get the note with the provided id and that has their userId
router.get("/:id", async (req, res, next) => {
    const noteId = req.params.id;
    const userId = req.userId;
    if (!userId) {
        res.status(401).send(e.message);
    } else {
        const validNoteId = mongoose.Types.ObjectId.isValid(noteId);
        if (!validNoteId) {
            res.sendStatus(400);
        } else {
            const userNote = await noteDAO.getNote(userId, noteId);
            if (userNote) {
                res.json(userNote);
            } else {
                res.status(404).send('Not found');
            }
        }
    }
});

//ERROR HANDLER

//router.use(error, req, res, next) - can be used to handle errors
//where the provided note id is not a valid ObjectId.
//This can be done without middleware though.
router.use(function (error, req, res, next) {
    if (error.message.includes("invalid")) {
        res.status(400).send('Invalid ID');
    } else if (error.message.includes("token")) {
        res.sendStatus(401);
    } else if (error.message.includes("duplicate")) {
        res.status(409).send('Account already exists');
    } else {
        res.sendStatus(500);
    }
});

module.exports = router;