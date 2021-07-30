const tokenDAO = require('../daos/token');

async function isLoggedIn(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.sendStatus(401);
  }
  
  const token = authorization.split(' ')[1];
  const user = await tokenDAO.getUserFromToken(token);
  if (!user) {
    return res.sendStatus(401);
  } else {
    req.userId = user.userId;
    next();
  }
}

module.exports = isLoggedIn;
