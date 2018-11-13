var express = require('express');
var router = express();
var passport = require('passport');
var User = require("../model/user");

router.get('/transmittal', (req, res)=>{
    res.render('transmittal');
});

//REGISTER FORM
router.get("/register", function(req, res){
    res.render("register")
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
    //provide by passport-local-mongoose
    var newUser = new User ({
        username: req.body.username,
        address: req.body.address,
        publicKey: req.body.publicKey
    });
    User.register(newUser, req.body.password, 
        function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
                
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/transmittal");
            })
      })
})

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
})

//HANDLES LOGIN IN LOGIC
//router.post("/login", middleware, callback func)
router.post("/login", passport.authenticate
    ("local", {successRedirect: "/transmittal",failureRedirect: "/login"}), 
                    function(req, res){
    });

module.exports = router;

