const { Router } = require("express");
const router = Router();
const { isLoggedIn } = require("../middleware/auth");

const noteDAO = require('../daos/note');

router.use(isLoggedIn);

router.post("/", async (req, res, next) => {
  try {
    const userId = req.userId;
    const note = req.body;
    const savedNote = await noteDAO.createNote(userId, note);
    res.json(savedNote);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.userId;
    const savedNotes = await noteDAO.getUserNotes(userId);
    res.json(savedNotes);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    const note = await noteDAO.getNote(userId, noteId);
    if (!note) {
      res.status(404).send('Note not found');
    } else {
    res.json(note);
    }
  } catch (e) {
    if (e.message.includes("ObjectId failed")){
    res.sendStatus(400);
    }
    next(e);
  }
});



module.exports = router;
