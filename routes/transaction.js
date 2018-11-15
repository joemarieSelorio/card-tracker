var express = require('express');
var nem = require('nem-sdk').default;
var router = express();
var User = require("../model/user");

function notEmpty(obj) { 
    for (var x in obj) { return true; }
    return false;
 }

router.get('/courier/transactions/:id', (req, res) =>{
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Cannot find the campground");
            res.redirect("/campgrounds")
        }else{
        let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
        nem.com.requests.account.transactions.all(endpoint, foundUser.address).then(function(res) {
                    res.data.forEach((data) =>{
                        if(notEmpty(data.transaction.message)){
                            var message = nem.utils.convert.hex2a(
                                data.transaction.message.payload
                            );
                            if(message.length > 100){
                                let messageData = JSON.parse(message);
                                console.log(messageData);
                            }
                        }
                    });
        }, function(err) {
                console.error(err);
        });
        res.render("courier/transaction");
        }
    });
});

module.exports = router;