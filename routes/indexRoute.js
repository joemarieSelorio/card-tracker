var express = require('express');
var router = express();
var passport = require('passport');
var middleware = require("../middleware")
var User = require("../model/user");
var nem = require('nem-sdk').default;

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

router.get('/transmittal', middleware.isLoggedIn, (req, res)=>{
    res.render('transmittal');
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
 });

router.get('/main', middleware.isLoggedIn, (req, res)=>{
    var user = req.user;

    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    nem.com.requests.account.transactions.all(endpoint, user.address).then(function(trans){
        if(trans){
            var transactions = [];
                for(let i = 0; i < trans.data.length; i++){
                    if(trans.data[i].transaction.message){
                        var  message = nem.utils.convert.hex2a(
                            trans.data[i].transaction.message.payload
                        );
                    if(message.length > 100) {
                        if(trans.data[i]){
                            if(IsJsonString(message)){
                                var d = Date(); 
                                a = d.toString() ;
                                var msg = JSON.parse(message);
                                transaction = {
                                    batch:msg[0].batchName,
                                    sentDate:a,
                                    hash: trans.data[i].meta.hash.data
                                }
                                transactions.push(transaction);
                            }
                        }
                    }
                 }
            }
        }
        res.render('main', {transactions: transactions, user: user});      
            }, function(err) {
        });
    });

    router.post('/main/view', middleware.isLoggedIn, function(req, res){
        var user = req.user;
        var hash = req.body.hash;
        var transactions;
        let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
         nem.com.requests.transaction.byHash(endpoint, hash).then(function(trans){
                    var  message = nem.utils.convert.hex2a(
                        trans.transaction.message.payload
                    );
                    if(message.length > 100) {
                        if(IsJsonString(message)){
                            var d = Date(); 
                            a = d.toString() ;
                            transactions = JSON.parse(message);
                            res.render('view', {transactions: transactions, user: user}); 
                        }
                }
        });
        console.log(transactions);
    });

//REGISTER FORM
router.get("/register", function(req, res){
    res.render("register")
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
    var user = req.user;
    //provide by passport-local-mongoose
    var newUser = new User ({
        username: req.body.username,
        address: req.body.address,
        publicKey: req.body.publicKey,
        privateKey: req.body.privateKey
    });
    User.register(newUser, req.body.password, 
        function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/main");
            })
      })
});

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
})
//HANDLES LOGIN IN LOGIC
//router.post("/login", middleware, callback func)
router.post("/login", passport.authenticate
    ("local", {successRedirect: "/main",failureRedirect: "/login"}), 
                    function(req, res){
                        console.log(req.user)
    });

module.exports = router;

