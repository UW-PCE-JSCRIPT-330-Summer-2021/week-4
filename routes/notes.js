const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

// Create: POST /notes
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const savedNote = await noteDAO.createNote(req.userId, req.body);
    res.json(savedNote);
  } catch (e) {
    next(e);
  }
});

// Get all of my notes: GET /notes
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const savedNotes = await noteDAO.getAll(req.userId);
    res.json(savedNotes);
  } catch (e) {
    next(e);
  }
});

// Get a single note: GET /notes/:id
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const savedNote = await noteDAO.getOneNote(req.userId, req.params.id);
    if (!savedNote) {
      res.status(404).send('Note not found');
    } else {
      res.json(savedNote);
    }
  } catch (e) {
    next(e);
  }
});

// Error handling middleware
router.use(function (err, req, res, next) {
  if (err.message.includes("Cast to ObjectId failed")) {
    res.status(400).send('Invalid note id provided');
  } else {
    res.status(500).send(err.message);
  }
});

// Authenticated?
async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    const tokenString = token.split(' ')[1];
    const match = await tokenDAO.getUserIdFromToken(tokenString);
    if (!match) {
      res.status(401).send('Incorrect login credentials');
    } else {
      req.userId = match.userId;
      next();
    }
  } else {
    res.status(401).send('Not logged in');
  }
}

module.exports = router;
