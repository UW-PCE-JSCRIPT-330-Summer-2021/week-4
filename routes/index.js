const { Router } = require("express");
const router = Router();

/*
    My original attempt was to utilize a "filter"
    function that would bypass the "/signup" route
    to validate that the request body had the necessary
    elements for the request; however, as my testing
    continued this proved to cause more issues and so
    it was removed.
*/
router.use('/login', require('./login'));
router.use('/notes', require('./notes'));


module.exports = router;