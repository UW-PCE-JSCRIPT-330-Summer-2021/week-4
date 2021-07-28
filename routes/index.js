const { Router } = require("express");
const router = Router();

router.use("/login", require('./login'));
router.use("/notes", require('./notes'));

module.exports = router;
