const { Router } = require("express");
const router = Router();

// const filter = function (path, middleware) {
//     return function(req, res, next) {
//         if(path === req.path) {
//             return next();
//         } else {
//             return middleware(req, res, next);
//         }
//     }
// }


// router.use(filter('/login/signup',require('../middleware/checkUser')));
router.use('/login', require('./login'));
router.use('/notes', require('./notes'));


module.exports = router;