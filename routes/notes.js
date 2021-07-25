const { Router } = require("express");
const router = Router({ mergeParams: true });


const noteDAO = require("../daos/note");
const isLoggedIn = require("../middleware/logging");

router.use(async (req, res, next) => {
  isLoggedIn(req, res, next);
});


//  If the user is logged in, it should store the incoming note along with their userId
router.post("/", async (req, res, next) => {
  let user = req.user;
  let note = req.body;
  if (!note) {
    res.status(401).send("Note not found");
    return;
  }
  let newNote = await noteDAO.createNote(user._id, note.text);

  res.json(newNote);
});

// If the user is logged in, it should get all notes for their userId
router.get("/", async (req, res, next) => {
  let notes = await noteDAO.getUserNotes(req.user._id);
  res.json(notes);
});


//    If the user is logged in, it should get the note with the provided id and that has their userId
router.get("/:id", async (req, res, next) => {
  try {
    let note = await noteDAO.getNote(req.user._id, req.params.id);
    res.json(note);
  } catch (e) {
    // res.status(400).send(e.message);
    next(e);
  }
});


router.use(function (err, req, res, next) {
  if (err.message.includes("Cast to ObjectId failed")) {
    res.status(400).send("Invalid id provided");
  } else if (err.message.includes("Not found")) { 
    res.status(404).send("Object not found");
  } else {
    res.status(500).send("Server error");
  }
});

module.exports = router;