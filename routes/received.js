const express = require('express');
const router = express();
var User = require("../model/user");
var middleware = require("../middleware");
var nem = require('nem-sdk').default;

function notEmpty(obj) { 
    for (var x in obj) { return true; }
    return false;
 }
 
router.get('/received', function(req, res) {
    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    nem.com.requests.account.transactions.incoming(endpoint, "TAVLKRJNGA43QPF7TATJNYR3KC7KNPUPUA72IQ3R").then(function(trans){
        var message = nem.utils.convert.hex2a(
            trans.data[0].transaction.message.payload
        );
            var transObj = JSON.parse(message);
            for(let i = 0; i < transObj.length; i++){
                if(i === transObj.length -1){
                    console.log(transObj);
                    res.render('incoming', {transmittal: transObj});
                }
            }
        }, function(err) {
    });
});

module.exports = router;