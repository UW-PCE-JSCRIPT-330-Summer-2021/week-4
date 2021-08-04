const { Router } = require("express");
const router = Router();


router.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    next();
});

router.use(function (err, req, res, next) {  
    if (err.message.includes("Cast to ObjectId failed")) {   
        res.status(400).send('Invalid id provided');  
    } else if (err.message.includes("password: Password is required")) {   
            res.status(400).send('Password is required');
    } else {    
        res.status(500).send('Something broke!')  
    }
});
