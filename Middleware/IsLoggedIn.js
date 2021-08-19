const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');
// const user = require("../models/user");

const tokenDAO = require('../daos/token');
// const token = require("../models/token");
module.exports = {};

module.exports = async (req, res, next) => {
    try {
        //console.log("ISLOGGEDIN ---> START");
        const AuthHeader = req.headers.authorization;
        //console.log(`AuthHeader = ${AuthHeader}`);
        if (AuthHeader && typeof(AuthHeader !== 'undefined')){
            const auth = AuthHeader.split(' ');
            req.token = auth[1];

            const tokenObject = await tokenDAO.getUserIdFromToken(req.token);
            //console.log(`tokenObject = ${tokenObject}`);
            if (tokenObject) {
                req.user = await userDAO.getById(tokenObject.userId);
                //console.log(` req.user = ${ req.user}`);
                if (!req.user) {
                    throw new Error('User not found');
                }
            }
        }

        if (req.token && req.user) {
            req.tokenIsValid = true;
        } else {
            // return unauthorized
            req.tokenIsValid = false;
        }
        next();
    } catch (e) {

    }
 };
