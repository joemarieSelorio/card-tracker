const express = require('express');
const router = express();
var User = require("../model/user");
var middleware = require("../middleware");
var nem = require('nem-sdk').default;

function notEmpty(obj) { 
    for (var x in obj) { return true; }
    return false;
 }

router.get('/received', function(res, req){
    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    nem.com.requests.account.transactions.incoming(endpoint, "TCDOSPLL5GIGTZZXEE6UDZR4NF5NNNW6WQGFDC4M").then(function(res) {
            res.data.forEach((data) =>{
               if(notEmpty(data.transaction.message)){
                  var message = nem.utils.convert.hex2a(
                    data.transaction.message.payload
                );
                     if(message.length > 100){
                        console.log(message);
                        var data = message.split(",");
                        console.log("=====================");
                        console.log(data);

                        var transmittal = {
                            nemaddress : data[1],
                            name: data[2] ,
                            address: data[3],
                            status: data[4]
                        }

                       return transmittal;
                       
                     }
                }
                
            });
    }, function(err) {
        console.error(err);
        
        });
        console.log(transmittal);
        res.render('incoming', {transmittal: transmittal});
});
module.exports = router;