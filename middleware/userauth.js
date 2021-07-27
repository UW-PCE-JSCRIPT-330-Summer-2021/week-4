const tokenDAO = require('../daos/token');
const tokenString = require('../models/token');

module.exports = {};

module.exports.isLoggedIn = async (req, res, next) => {
    const userToken = req.headers.authorization;
    try {
        if (userToken) {
            const callbackToken = userToken.split(' ')[1];
            const userId = await tokenDAO.getUserIdFromToken(callbackToken);

            if (userId) {
                req.userId = userId;
                req.tokenString = tokenString;
                next(e);
            } else {
                throw new Error("User is not logged in");
            }
        } else {
            throw new Error('User is not found');
        }
    } catch {
        next (e);
    }
}
