const { Router } = require('express');
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');
const { isLoggedIn } = require('../middleware/authentication');

// Posting New Note Route // 
router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const note = req.body;
        const userId = req.userId;
        // console.log(`Note: ${JSON.stringify(note, null, 2)}, userID: ${JSON.stringify(userId, null, 2)}`);
        const savedNote = await noteDAO.createNote(userId, note);
        res.json(savedNote);
    } catch (e) {
    }
});

// Find All Notes Route //
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const storeNotes = await noteDAO.getUserNotes(req.userId);
        res.json(storeNotes);
    } catch (e) {
        // console.log(`caught an exception: ${e}`)
    }
});

// Find Single Note Route // 
router.get("/:id", isLoggedIn, async (req, res, next) => {
    const requestId = req.params.id;
    const user = req.userId;
    // console.log( require('util').inspect( req.params ));
    try {
        const storeNote = await noteDAO.getNote(user, requestId);
        if (storeNote) {
            return res.status(200).send(storeNote);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(400);
        // console.log(`caught an exception in get/:id: ${e}`)
    }
});

// Create: POST /notes
// Get all of my notes: GET /notes
// Get a single note: GET /notes/:id

module.exports = router;