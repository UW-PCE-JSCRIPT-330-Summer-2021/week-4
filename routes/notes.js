const { Router } = require("express");
const router = Router();

const auth = require('../middleware/auth');
const User = require('../models/user');

const noteDAO = require('../daos/note');

router.post('/', auth.isLoggedIn, async (req,res,next) => {

    const note = req.body;

    try {
        const user = await User.findOne({ _id: req.userId }).lean();
        const newNote = await noteDAO.create(user._id, note);
        res.status(200).send(newNote);
    } catch(e) {
        next(e);
    }
});


router.get('/:id', auth.isLoggedIn, async (req,res,next) => {

    const noteId = req.params.id;
    const userId = req.userId;

    try {

        const userNote = await noteDAO.getNote(userId, noteId);

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

    const userId = req.userId;

    try {
        
        const userNotes = await noteDAO.getUserNotes(userId);

        if(userNotes) {
            res.status(200).send(userNotes);
        } else {
            throw new Error('Unauthorized access');
        }

    } catch(e) {
        next(e);
    }
});

router.use(function (err, req, res, next) {
    
    if(err.message.includes('User not found') || err.message.includes('Passwords do not match') || 
        err.message.includes('logged in') || err.message.includes('Bad Token'))
    {
        res.status(401).send(err.message);
    } else if(err.message.includes('required') || err.message.includes('noteId is invalid')) {
        res.status(400).send(err.message);
    } else if(err.message.includes('Unauthorized')) {
        res.status(404).send(err.message);
    }
     else {
        res.status(500).send(err.message);
    }
})


module.exports = router;