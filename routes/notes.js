const { Router } = require('express');
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

// Authentication and Token Validation //
async function isLoggedIn(req, res, next) {
    if (!req.session.user_id) {
        res.send('Not logged in');
    } else {
        next(e);
    }
};

router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const storeNote = await noteDAO.createNote(req.userId, req.body);
        res.json(storeNote);
    } catch (e) {
        next(e)
    }
});

router.get("/", async (req, res, next) => {
    try {
        const storeNotes = await noteDAO.getUserNotes(req.userId);
        res.json(storeNotes);
    } catch (e) {
        next(e)
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const storeNote = await noteDAO.getNote(req.userId, req.id);
        if (!storeNote) {
            res.status(404).send("Cannot find note");
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