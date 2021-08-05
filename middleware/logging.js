const { Router } = require("express");
const userDAO = require("../daos/user");
const tokenDAO = require("../daos/token");

const isLoggedIn = async function (req, res, next) {
  let token = req.header("Authorization");
  if (!token) {
    res.status(401).send("Token not found");
    return;
  }
  let bearer = "Bearer ";
  if (!token.startsWith(bearer)) {
    return res.status(401).send("Token is not valid");
  }
  token = token.substring(bearer.length).trim();
  const userId = await tokenDAO.getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).send("Token record is not found");
  }
  const user = await userDAO.getUserById(userId);

  req.user = user;
  req.token = token;
  next();
};

module.exports = isLoggedIn;
