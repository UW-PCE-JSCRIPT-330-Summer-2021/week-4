const { Router } = require("express");
const router = Router();
router.post("/login", require("./users"))


module.exports = router;