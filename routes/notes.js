const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

// Create
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const savedNote = await noteDAO.createNote(req.userId, req.body);
    res.json(savedNote);
  } catch (e) {
    next(e);
  }
});

// Read all
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const savedNotes = await noteDAO.getUserNote(req.userId);
    res.json(savedNotes);
  } catch (e) {
    next(e);
  }
});

// Read single note
router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const savedNote = await noteDAO.getNote(req.userId, req.params.id);
    if (!savedNote) {
      res.status(404).send('No notes founds');
    } else {
      res.json(savedNote);
    }
  } catch (e) {
    next(e);
  }
});

// Error handle middleware
router.use(function (err, req, res, next) {
  if (err.message.includes("Cast to ObjectId failed")) {
    res.status(400).send('Invalid note id provided');
  } else {
    res.status(500).send(err.message);
  }
});

// Token check middleware
async function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send('Unauthorized - Not logged in');
  } else {
    const tokenString = token.split(' ')[1];
    const match = await tokenDAO.getUserIdFromToken(tokenString);
    if (!match) {
      res.status(401).send('Unauthorized - Incorrect login info');
    } else {
      req.userId = match.userId;
      next();
    }
  }
}

module.exports = router;