const express = require('express');
const router = express();
var User = require("../model/user");
var middleware = require("../middleware");
var nem = require('nem-sdk').default;
Transaction = require("../model/transaction");

function notEmpty(obj) { 
    for (var x in obj) { return true; }
    return false;
 }

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

router.get('/received', middleware.isLoggedIn, function(req, res) {
    var user = req.user;
    console.log(user.address);
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
        res.render('received', {transactions: transactions, user: user});      
            }, function(err) {
        });
});

router.get('/received/status', middleware.isLoggedIn, function(req, res) {
    var user = req.user;
    console.log(user.address);
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
        res.render('ongoing', {transactions: transactions, user: user});      
            }, function(err) {
        });
});

router.post('/verify',middleware.isLoggedIn, function(req, res){
    var hash = req.body.hash;
    var user = req.user;
    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    nem.com.requests.transaction.byHash(endpoint, hash).then(function(trans){
        
                var  message = nem.utils.convert.hex2a(
                    trans.transaction.message.payload
                );
                var transactions = JSON.parse(message);
                res.render('verify', {transactions: transactions, user: user});
        
             });
         }, function(err){
    });
    router.post('/verify/send',middleware.isLoggedIn, function(req, res){
    
    });

    router.post('/received/status',middleware.isLoggedIn, function(req, res){
        var hash = req.body.hash;
        var user = req.user;
        let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
        nem.com.requests.transaction.byHash(endpoint, hash).then(function(trans){
           
                    var  message = nem.utils.convert.hex2a(
                        trans.transaction.message.payload
                    );
                    var transactions = JSON.parse(message);
                    res.render('sendStatus', {transactions: transactions, user: user});
            
                 });
             }, function(err){
        });



    
module.exports = router;