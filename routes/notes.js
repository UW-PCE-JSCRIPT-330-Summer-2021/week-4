const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');
const isLoggedIn = require('../middleware/auth')

router.post("/", isLoggedIn, async (req, res) => {
  if (!req.body) {
    return res.sendStatus(401);
  }
  try {
    let newNote = req.body;
    newNote.userId = req.userId;
    const createdNote = await noteDAO.createNote(newNote);
    return res.status(200).send(createdNote);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const notes = await noteDAO.getAll(req.userId);
    return res.status(200).send(notes);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const note = await noteDAO.getUserNote(req.userId, req.params.id);
    if (!note) {
      return res.sendStatus(404);
    } else {
      return res.status(200).send(note);
    }
  } catch (e) {
    if (e.message.includes("Cast to ObjectId failed")) {
      return res.sendStatus(400);
    }
    return res.status(500).send(e.message);  }
});

module.exports = router;