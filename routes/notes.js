const { Router } = require('express');
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');
const { isLoggedIn } = require('../middleware/authentication');

router.use(isLoggedIn);

router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const user = req.body;
        const savedNote = await noteDAO.createNote(req.userId, user);
        res.json(savedNote);
    } catch (e) {
        next(e)
    }
});

router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const storeNotes = await noteDAO.getUserNotes(req.userId);
        res.json(storeNotes);
    } catch (e) {
        next(e)
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const storeNote = await noteDAO.getNote(req.userId, req.params.id);
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