var nem = require("nem-sdk").default;
var User = require("./model/user");
console.log('starting')

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

// let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
//     nem.com.requests.account.transactions.incoming(endpoint, "TAVLKRJNGA43QPF7TATJNYR3KC7KNPUPUA72IQ3R").then(function(trans) {
//         var message = nem.utils.convert.hex2a(
//             trans.data[0].transaction.message.payload
//         );
//             var transObj = JSON.parse(message);
//             for(let i = 0; i< transObj.length; i++){
//                 var transmittal = {
//                    batch: transObj[i].batchName,
//                    nemaddress: transObj[i].nemaddress,
//                    name: transObj[i].name,
//                    address: transObj[i].address,
//                    status: transObj[i].status
//                 }
//                 if(i === transObj.length -1){
//                     res.render('incoming', {transmittal: transmittal});
//                 }
//             }
//         }, function(err) {
// });

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


