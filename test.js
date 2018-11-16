var nem = require("nem-sdk").default;
var User = require("./model/user");
console.log('starting')


function notEmpty(obj) { 
    for (var x in obj) { return true; }
    return false;
 }

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

                     let transmittal = {
                         nemaddress : data[1],
                         name: data[2] ,
                         address: data[3],
                         status: data[4]
                     }
                     
                   
                  }
             }
         });

 }, function(err) {

     console.error(err);
     
     });




// var send = function () {
//    var nem = require('nem-sdk').default;
//    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
//    let common = nem.model.objects.create('common')
//            ('12345', '93717a4a04d48af658de7e96e31fdc48ba46d4888b6bd1d2f140d59e0479ba02');
//    let transferTransaction = nem.model.objects.create('transferTransaction')
//        ('TCDOSPLL5GIGTZZXEE6UDZR4NF5NNNW6WQGFDC4M', 0, 'Test Message Latest');
   
//    let preparedTransaction = nem.model.transactions.prepare
//        ('transferTransaction')
//            (common, transferTransaction, nem.model.network.data.testnet.id);
   
//    nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
//        console.log(JSON.stringify(res));
//    }, function(err){
//        console.log(err);
//    });
// }

// send();


