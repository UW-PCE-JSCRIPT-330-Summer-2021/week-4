const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

// Create: POST /notes
// POST / - If the user is logged in, 
// it should store the incoming note along with their userId
router.post("/", isLoggedIn, async (req, res, next) => {  
  try {
    const savedNote = await noteDAO.createNote(req.userId, req.body);
    res.json(savedNote);
  } catch (e) {
    next (e)
  }
});

// Get all of my notes: GET /notes
// GET / - If the user is logged in, it should get all notes for their userId
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const notes = await noteDAO.getUserNotes(req.userId);
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

// Get a single note: GET /notes/:id
// GET /:id - If the user is logged in, 
// it should get the note with the provided id and that has their userId
router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const note = await noteDAO.getNote(req.userId, req.params.id);
    if (!note) {
      res.sendStatus(404);
    } else {
      res.json(note);
    }
  } catch (e) {
    next(e);
  }
});


async function isLoggedIn(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
      const tokenString = bearerToken.split(' ')[1];
      const userId = await tokenDAO.getUserIdFromToken(tokenString);
      if (userId) {
        req.userId = userId.userId;
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    next();
  }
};

router.use(function (err, req, res, next) {
  if (err.message.includes("Cast to ObjectId failed")) {
    res.status(400).send('Invalid ID provided');
  } else {
    res.status(500).send('Something broke!');
  }
});

module.exports = router;