const tokenDAO = require('../daos/token');

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).send('Unauthorized - Not logged in');
        } else {
            const tokenString = token.split(' ')[1];
            const userId = await tokenDAO.getUserIdFromToken(tokenString);
            if (!userId) {
                res.status(401).send('Unauthorized - Incorrect login info');
            } else {
                req.userId = userId;
                req.tokenString = tokenString
                next();
            }
        }
    }
    catch (e) {
        if (e.message.includes("Cannot read property")) {
            res.status(401).send(e.message);
        }
        next(e);
    }
}
