const tokenDAO = require('../daos/token');
//const userDAO = require('../daos/user') // extra
const jwt = require('jsonwebtoken');

//token
const SECRET_TOKEN =
	"x1x;U0K6R[J^(L&u'Hatu{8%Y<,Voj_2Q!]dLe(Vu^K+.Yx`g8q?f'%$CI#&Kccy;bJ~}~>pK@UCzR{>Eo2*-ax&T^(jKDH$nY3FK$*.&TJ#rJ9~owMFc;2;uaR[";

	//is loged in token greater than 1
async function isLoggedIn(req, res, next) {
	let token = req.headers.authorization;
	if (!token || token.length < 1) {
		res.sendStatus(401);
		return;
	}
	try {
		clientToken = token.replace('Bearer ', '');
		const { tokenString } = jwt.verify(clientToken, SECRET_TOKEN);
		const userId = await tokenDAO.getUserIdFromToken(tokenString);
		if (!userId) {
			throw new Error('Error: token not found.');
		}
		req.userId = userId;
		req.tokenString = tokenString;
		next();
	} catch (e) {
		res.status(401).send(e.message);
		return;
	}
}

module.exports = { SECRET_TOKEN, isLoggedIn };
