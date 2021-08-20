const { Router } = require("express");
const router = Router();

router.use("/ErrorReport", require('./ErrorReport'));
router.use("/IsLoggedIn", require('./IsLoggedIn'));

module.exports = router;