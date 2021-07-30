const { Router } = require("express");
const router = Router();
const { isLoggedIn } = require("../middleware/auth");

const noteDAO = require('../daos/note');

router.use(isLoggedIn);


router.get("/", async (req, res, next) => {
  try {
    const userId = req.body;
    const notes = await noteDAO.getUserNotes(userId);
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.body;
    const noteId = req.params.id;
    const notes = await noteDAO.getNote(userId, noteId);
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newNote = req.body;
    const userId = newNote.userId;
    if (!notes || JSON.stringify(notes) === '{}') {
      res.status(400).send('user is required');
    } else {
      const savedNote = await noteDAO.createNote(userId, newNote);
      res.json(savedNote);
    }
  } catch (e) {
    if (e.message.includes('validation failed:')) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send('Unexpected Server Error');
    }
  }
});

module.exports = router;
