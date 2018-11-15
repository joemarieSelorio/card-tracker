var nem = require("nem-sdk").default;
var User = require("./model/user");
console.log('starting')
function notEmpty(obj) { 
    for (var x in obj) { return true; }
    return false;
 }

 let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
 nem.com.requests.account.transactions.all(endpoint, "TARZJYIEPXABYOT3HXTLPTMAB2QMZOJWAOHWRPD6").then(function(res) {
            res.data.forEach((data) =>{
               if(notEmpty(data.transaction.message)){
                  var message = nem.utils.convert.hex2a(
                    data.transaction.message.payload
                );
                if(message.length > 100){
                  console.log(JSON.stringify(res, undefined, 2));
                }
                 
               }
            });
}, function(err) {
        console.error(err);
});

