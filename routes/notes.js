const { Router, query } = require("express");
const mongoose = require('mongoose');
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

//Token validation
const isLoggedIn = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        if (req.token) {
            const userId = await tokenDAO.getUserIdFromToken(req.token);
            if (userId) {
                req.userId = userId;
                next ();
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

//NOTES (requires authentication)

//Create: POST /notes
router.post("/", isLoggedIn, async (req, res, next) => {
    const userId = req.userId;
    const { text } = req.body;
    if (!userId) {
        res.sendStatus(401)
    } else {
        try {
            const newNote = await noteDAO.createNote (userId, text)
            res.json(newNote);
        } catch (e) {
            res.status(400).send(e.message);
        }
    }
});

//Get all of my notes: GET /notes
router.get("/", isLoggedIn, async (req,res, next) => {
    const userId = req.userId;
    if (!userId) {
        res.sendStatus(401)
    } else {
        const notes = await noteDAO.getUserNotes(userId);
        if (notes) {
            res.json(notes);
        } else {
            res.sendStatus(404);
        }
    }
});

//Get a single note: GET /notes/:id
router.get("/:id", isLoggedIn, async (req, res, next) => {
    const noteId = req.params.id;
    const userId = req.userId;
    if (!userId) {
        res.sendStatus(401)
    } else {
        const noteIdValidation = mongoose.Types.ObjectId.isValid(noteId);
        if (!noteIdValidation) {
            res.sendStatus(400);
        } else {
            const userNote = await noteDAO.getNote(userId, noteId);
            if (userNote) {
                res.json(userNote)
            } else {
                res.status(404).send('Note not found.');
            }
        }
    }
});

module.exports = router;