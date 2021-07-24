const { Router } = require("express");
const router = Router();

/*
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'qweasd')

        const userToken = await Tokens.findOne({ where: { userId: decoded._id, token } })
        const userId = userToken.userId
        const user = await User.findOne({ where: { id: userId } })

        if (!user) throw new Error()

        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'User not authenticated.' })
    }
}
*/

router.use("/login", require('./login'));
router.use("/notes", require('./notes'));

router.get("/", (req, res, next) => {
    res.status(200).send('hello from home page');
});

module.exports = router;