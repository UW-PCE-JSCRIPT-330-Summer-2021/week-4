const { Router } = require('express');
const tokenDAO = require('../daos/token');
const jwt = require('jsonwebtoken');
const secret = 'secretToken'

 async function isLoggedIn (req, res, next) {
  let token = req.headers.authorization;
  if (!token || token.length === 0) {
    res.status(401).send('No token found');
    return
  }
  try { 
    tokenProvided = token.replace('Bearer ', '');
    const { tokenString } = jwt.verify(tokenProvided, secret);
    const userId = await tokenDAO.getUserIdFromToken(tokenString);
    if (!userId) {
      throw new Error('Token not found');
    }
    req.userId = userId;
    req.tokenSting = tokenString;
    next();
  } catch (e) {
    res.sendStatus(401);
  }
}

module.exports = { isLoggedIn, secret }
