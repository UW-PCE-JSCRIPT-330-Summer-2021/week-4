const { Router } = require('express');
const router = Router();
//DAOs, bcrypt, jwt
const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// add token, error handling
const { isLoggedIn, SECRET_TOKEN } = require('../middleware/auth');
const { handleErrors } = require('../middleware/errorhandler');

//Signup
router.post('/signup', async (req, res, next) => {
	const user = req.body;
	if (!user) {
		res.status(400).send('User not found');
		return;
	}
	if (!user.email) {
		res.status(400).send('Email not found');
		return;
	}
	if (user.email.trim() === '') {
		res.status(400).send('Empty email');
		return;
	}
	if (!user.password) {
		res.status(400).send('Password not found');
		return;
	}
	if (user.password.trim() === '') {
		res.status(400).send('Empty Password');
		return;
	}
	const email = user.email.trim();

	const checkUser = await userDAO.getUser(email);

	if (checkUser) {
		res.status(409).send('User is already exists');
		return;
	}

	const textPassword = user.password.trim();
	let savedHash = await bcrypt.hash(textPassword, 10);

	const postedUser = await userDAO.createUser({
		email: email,
		password: savedHash,
	});
	req.user = postedUser;
	res.status(200).send('Ok');
});

//bcrypt compare
router.post('/', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email) {
			res.status(400).send('No email provided');
			return;
		}
		if (!password) {
			res.status(400).send('No password provided');
			return;
		}
		const foundUser = await userDAO.getUser(email);
		if (!foundUser || foundUser.length === 0) {
			res.sendStatus(401);
			return;
		}

		bcrypt.compare(
			password,
			foundUser.password,
			async function (bcryptErr, bcryptRes) {
				if (bcryptErr) {
					res.sendStatus(401);
				}
				if (bcryptRes) {
					const tokenToSave = {
						tokenString: await tokenDAO.getTokenForUserId(
							foundUser._id.toHexString()
						),
					};
					const createdToken = jwt.sign(tokenToSave, SECRET_TOKEN);
					res.status(200).send({ token: createdToken });
				} else {
					res.sendStatus(401);
				}
			}
		);
	} catch (e) {
		next(e);
	}
});

router.use(isLoggedIn);

router.post('/password', async (req, res, next) => {
	try {
		const password = req.body.password;
		if (!password || password.length < 1) {
			res.status(400).send('No password provided');
			return;
		}
		const encryptedPw = await bcrypt.hash(password, 10);
		await userDAO.updateUserPassword(req.userId, encryptedPw);
		res.sendStatus(200);
	} catch (e) {
		next(e);
	}
});

router.post('/logout', async (req, res, next) => {
	let tokenString = req.tokenString;
	tokenDAO.removeToken(tokenString);
	res.status(200).send('user is required');
});

router.use(handleErrors);

module.exports = router;
