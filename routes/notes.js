const { Router } = require('express');
const router = Router({ mergeParams: true });

const { isLoggedIn } = require('../middleware/authentication');
const noteDAO = require('../daos/note');

router.use(async (req, res, next) => {
  isLoggedIn(req, res, next);
});

// Create note  
router.post('/', async (req, res, next) => {
  let { user, note } = req.body;
  if (!note) {
    res.status(401).send('Note is required');
  } else {
    try {
      const savedNote = await noteDAO.createNote(user._id, note.text);
      res.status(200).send(savedNote);
    } catch (e) {
     res.sendStatus(500);
    } 
  }
});

// Read all user notes
router.get('/', async (req, res, next) => {
  try {
    const userNotes = await noteDAO.getUserNotes(req.userId);
    res.status(200).send(userNotes);
  } catch (e) {
    next(e);
  }
});

// Read single note 
router.get('/:id', async (req, res, next) => {
  try {
    const note = await noteDAO.getNote(req.userId, req.params.id);
    if (!note) {
      res.status(404).send('Note not found');
    } 
    else {
      res.status(200).send(note);
    }
  } catch (e) {
    throw e;
  }
});

module.exports = router;
