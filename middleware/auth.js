const tokenDAO = require('../daos/token');

module.exports = {};

module.exports.isLoggedIn = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    try {
        if(bearerToken) {
            const token = bearerToken.split(' ')[1];
            const userId = await tokenDAO.getUserFromToken(token);

            if(userId) {
                req.userId = userId;
                req.token = token;
                next();
            } else {
                throw new Error('User not logged in');
            }
        } else {
            throw new Error('User not found');
        }
    } catch {
        next(new Error('Bad Token'));
    }
}