const { Router } = require('express');
const router = Router();
const { isLoggedIn } = require('../middleware/auth');
const noteDAO = require('../daos/note');

router.use(async (req, res, next) => {
	isLoggedIn(req, res, next);
});


router.post('/', async (req, res, next) => {
	try {
		const note = await noteDAO.createNote(req.userId, req.body);
		res.status(200).send(note);
	} catch (e) {
		next(e);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const note = await noteDAO.getNote(req.userId, req.params.id);
		if (!note) {
			res.sendStatus(404);
		} else {
			res.status(200).send(note);
		}
	} catch (e) {
		if (e.message.includes('invalid')) e.status = 400;
		next(e);
	}
});

router.get('/', async (req, res, next) => {
	try {
		const myNotes = await noteDAO.getUserNotes(req.userId);
		res.status(200).send(myNotes);
	} catch (e) {
		next(e);
	}
});

router.use(function (err, req, res, next) {
	if (err.message.includes('Cast to ObjectId failed')) {
		res.status(400).send('Invalid id');
	} else if (err.message.includes('Sorry. Not found')) {
		res.status(404).send('Sorry. The object is not found');
	} else {
		res.status(500).send('Server error');
	}
});


module.exports = router;
