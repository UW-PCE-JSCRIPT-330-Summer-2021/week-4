const tokenDAO = require('../daos/token')
const jwt = require('jsonwebtoken')
// I considered putting this in a .env file, but read conflicting info on if this was best practice. Not sure.
const SECRET_TOKEN = "x1x;U0K6R[J^(L&u'Hatu{8%Y<,Voj_2\Q!]dLe(Vu^K+.\Yx`g8q?f'%$CI#&Kccy;bJ~}~>pK@UCzR{>Eo2*-ax&T^(jKDH$nY3FK$*.&TJ#rJ9~owMFc;2;uaR["

async function isLoggedIn (req, res, next) {
    let token = req.headers.authorization
    if (!token || token.length < 1) {
        res.sendStatus(401)
        return
    }
    try {
        tokenFromClient = token.replace('Bearer ', '')
        const { tokenString } = jwt.verify(tokenFromClient, SECRET_TOKEN)
        const userId = await tokenDAO.getUserIdFromToken(tokenString)
        if (!userId) {
            throw new Error("Cannot find token from provided token string")
        }
        req.userId = userId
        req.tokenString = tokenString
        next()
    }
    catch (e) {
        res.status(401).send(e.message)
        return
    }
}

module.exports = { SECRET_TOKEN, isLoggedIn }
