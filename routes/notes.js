const { Router } = require('express');
const router = Router();

const errorHandler = require('../middleware/errorHandler');
const noteDAO = require('../daos/note');


router.post("/", async (req, res, next) => {
    try {
        if (req.body) {
            let createdNote = await noteDAO.createNote(req.userId, req.body.text);
            res.json(createdNote);
        } else {
            res.status(401).send("Incoming note is not found");
        }
    } catch (e) {
        next (e);
    }
});

// User is logged in, getting all notes for userId
router.get("/", async (req, res, next) => {
    try {
        let userAllNotes = await noteDAO.getUserNotes(req.userId);
        res.json(userAllNotes);
    } catch (e) {
        next (e);
    }
});

router.get("/:id", async (req, res, next ) => {
    try {
        let userNote = await noteDAO.getNote(req.userId, req.params.id);
        res.json(userNote);
    } catch (e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;
