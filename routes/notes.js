const { Router } = require("express")
const router = Router()
const { isLoggedIn } = require("../middleware/auth")
const noteDAO = require('../daos/note')

router.use(isLoggedIn)

router.post("/", async (req, res, next) => {
    try {
        const note = await noteDAO.createNote(req.userId, req.body)
        res.status(200).send(note)
    }
    catch (e) {
        next(e)
    }    
})

router.get("/:id", async (req, res, next) => {
    try {
        const note = await noteDAO.getNote(req.userId, req.params.id)
        if (!note) {
            res.sendStatus(404)
        }
        else {
            res.status(200).send(note)
        }
    }
    catch (e) {
        if (e.message.includes("invalid"))
            e.status = 400
        next(e)
    }
});

router.get("/", async (req, res, next) => {
    try {
        const myNotes = await noteDAO.getUserNotes(req.userId)
        res.status(200).send(myNotes)
    }
    catch (e) {
        next(e)
    }
})

module.exports = router
