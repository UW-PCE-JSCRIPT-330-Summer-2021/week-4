const { Router } = require("express");
const router = Router();

const auth = require('../middleware/auth');
const errorHandler = require('../middleware/errors');
const noteDAO = require('../daos/note');

router.post('/', auth.isLoggedIn, async (req,res,next) => {

    const note = req.body;

    try {
        const newNote = await noteDAO.create(req.userId, note);
        res.status(200).send(newNote);
    } catch(e) {
        next(e);
    }
});


router.get('/:id', auth.isLoggedIn, async (req,res,next) => {

    try {

        const userNote = await noteDAO.getNote(req.userId, req.params.id);

        if(userNote) {
            res.status(200).send(userNote);
        } else {
            throw new Error('Unauthorized access');
        }

    } catch(e) {
        next(e);
    }
});

router.get('/', auth.isLoggedIn, async (req,res,next) => {

    try {
        
        const userNotes = await noteDAO.getUserNotes(req.userId);

        if(userNotes) {
            res.status(200).send(userNotes);
        } else {
            throw new Error('Unauthorized access');
        }

    } catch(e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;