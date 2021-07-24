const { Router } = require("express")
const tokenDAO = require('../daos/token');
const jwt = require('jsonwebtoken');
const SECRET_TOKEN = "SeCrEtToKeN";

async function isLoggedIn (req, res, next) {
    let token = req.headers.authorization;
    if (!token || token.length < 1) {
        res.sendStatus(401);
        return;
    }
    try {
        tokenFromClient = token.replace('Bearer ', '');
        const { tokenString } = jwt.verify(tokenFromClient, SECRET_TOKEN);
        const userId = await tokenDAO.getUserIdFromToken(tokenString);
        if (!userId) {
            throw new Error("Cannot find token from provided token string");
        }
        req.userId = userId;
        req.tokenString = tokenString;
        next();
    }
    catch (e) {
        res.status(401).send(e.message);
        return;
    }
}

module.exports = { SECRET_TOKEN, isLoggedIn }
