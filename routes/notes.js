const { Router } = require('express');
const router = Router();

const errorHandler = require('../middleware/errorHandler');
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

router.post("/", isLoggedIn, async (req, res, next) => {  
    try {
        const createdNote = await noteDAO.createNote(req.userId, req.body);
        res.json(createdNote);
    } catch (e) {
        next (e)
    }
});

router.get("/", isLoggedIn, async (req, res, next) => {
    try {
        const userAllNotes = await noteDAO.getUserNotes(req.userId);
        res.json(userAllNotes);
    } catch (e) {
        next(e);
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
    try {
        const userNote = await noteDAO.getNote(req.userId, req.params.id);
        if (!userNote) {
            res.sendStatus(404);
        } else {
            res.json(userNote);
        }
    } catch (e) {
        next(e);
    }
});


async function isLoggedIn(req, res, next) {    
    try {
        const userToken = req.headers.authorization;
        if (userToken) {
            const callbackToken = userToken.split(' ')[1];
            const userId = await tokenDAO.getUserIdFromToken(callbackToken);

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
        next(e);
    }
};

router.use(errorHandler);

module.exports = router;
