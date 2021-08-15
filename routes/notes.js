const { Router } = require('express');
const router = Router();
const noteDAO = require('../daos/note');
const { isLoggedIn } = require('../middleware/authentication');

// Posting New Note Route // 
router.post("/", isLoggedIn, async (req, res, next) => {
    if (!req.body) {
        res.sendStatus(401);
    }
    try {
        const note = req.body;
        const userId = req.userId;
        const savedNote = await noteDAO.createNote(userId, note);
        res.json(savedNote);
    } catch (e) {
        next(e)
    }
});

// Find All Notes Route //
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const storeNotes = await noteDAO.getUserNotes(req.userId);
        res.json(storeNotes);
    } catch (e) {
        next(e)
    }
});

// Find Single Note Route // 
router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const storeNote = await noteDAO.getNote(req.userId, req.params.id);
        if (!storeNote) {
            res.sendStatus(404);
        } else {
            res.json(storeNote);
        }
    } catch (e) {
        next(e)
    }
});

// Create: POST /notes
// Get all of my notes: GET /notes
// Get a single note: GET /notes/:id

module.exports = router;