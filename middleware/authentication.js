const tokenDAO = require('../daos/token');

// Authentication and Token Validation //
module.exports.isLoggedIn = async (req, res, next) => {
    const uniqueToken = req.headers.authorization;
    try {
        if (uniqueToken) {
            const token = uniqueToken.split(' ')[1];
            const userId = await tokenDAO.getUserFromToken(token);
            if (!userId) {
                return res.sendStatus(401);
            } else {
                req.userId = userId;
                req.token = token;
                next();
            }
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
    }
};