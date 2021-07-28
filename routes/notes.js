const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

//POST / -
//If the user is logged in, it should store the incoming note along with their userId
router.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const notes = await noteDAO.createNote(req.userId, req.body);
        if (notes) {
            res.json(notes);
        }
        else {
            res.status(401).send('Error');
        }
    }

    catch (e) {
        next(e);
    }
});

//GET / -
//If the user is logged in, it should get all notes for their userId
router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const notes = await noteDAO.getUserNotes(req.userId);
        if (notes) {
            res.json(notes);
        }
        else {
            res.status(401).send('Error');
        }
    }

    catch (e) {
        next(e);
    }
});

//GET /:id -
//If the user is logged in, it should get the note with the provided id and that has their userId
router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const notes = await noteDAO.getNote(req.userId, req.params.id);
        if (notes) {
            res.json(notes);
        }
        else {
            res.status(200).send("Invalid");
        }
    }
    catch (e) {
        next(e);
    }
});

router.use(function (error, req, res, next) {
    try {
        if (error.message.inclues("Cast to ObjectId failed")) {
            res.status(400).send("Invalid note id");
        }
        else {
            res.status(405).send(error.message);
        }
    }
    catch (e) {
        next(e);
    }

});

async function isLoggedIn(req, res, next) {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split (' ')[1];
            req.token = token;
            if (req.token) {
                const userId = await tokenDAO.getUser(req.token);
                if (userId) {
                    res.sendStatus(200);
                    next();
                }
            }
        }
    }
    
    catch (e) {
        next(e);
    }
};

module.exports = router;