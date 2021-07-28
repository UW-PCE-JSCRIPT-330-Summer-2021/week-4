const { Router } = require("express");
const router = Router();
const userDAO = require("../daos/user");
const tokenDAO = require("../daos/token");
const bcrypt = require('bcrypt');
const user = require("../models/user");
const saltRounds =10
router.post("/signup", async (req, res, next) =>{
   const newUser =new User ({
       name: req.body.name,
       password: req.body.password,
       email: req.body.email
   });
   await newUser.findOne({name: newUser.name})
   .then(async profile =>{
       if(!profile){
           bcrypt.hash(newUser.passport, saltRounds, async (err, hash) =>{
               if(err){
                   console.log("Error is", err.message);
               }else{
                   newUser.password =hash;
                   await newUser
                   .save()
                   .then(() =>{
       res.status(200).send(newUser);
   })
   .catch(err =>{
       console.log("error is", err.message)
   });
     }
    });
}else{
    res.send("user already exist");
}
   })
   .catch(err =>{
       console.log("Error is", err.message);
   });
});

router.post("/login", async (req, res, next) =>{
    const newUser={};
    newUser.name = req.body.name;
    newUser.password = req.body.password;
    newUser.email = req.body.email
    await User.findOne ({name: newUser.name})
    .then(profile => {
        if(!profile){
            res.send("user does not exist");
        }else{
            bcrypt.compare(
                newUser.passport,
                profile.password,
                async (err, result) =>{
                    if(err){
                        console.log("Error is", err.message);
                    }else if (result == true){
                        res.send("User authenricated");
                    }else{
                       // res.send("User Unauthenticated Acess")
                        const payload ={
                            id: profile.id,
                            name: profile.name
                        };
                        jsonwt.sign(
                            payload,
                            key.secret,
                            {expiresIn: 3600},
                            (err, token) =>{
                                res.json({
                                    sucess: true,
                                    token:"Bearer" + token
                                });
                            }
                        );
                    } else {
                        res.send("User Unauthorized Access");
                    }
                    
                            }
                        );
                    }
                    })
        .catch(err =>{
            console.log("Error is", err.message)
        });
    });
    module.exports = router;