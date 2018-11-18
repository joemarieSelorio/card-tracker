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


let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
nem.com.requests.transaction.byHash(endpoint, '801574b09a122f540d72e0adbcbb24895ee6876d58c2a14f3cb43ee6677744a1').then(function(trans){
            console.log(trans);
            //  var  message = nem.utils.convert.hex2a(
                
            // );
            // console.log(message)
}, function(err){

});

//console.log(trans.data[0].meta.hash.data);
// let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
// nem.com.requests.account.transactions.all(endpoint, "TARZJYIEPXABYOT3HXTLPTMAB2QMZOJWAOHWRPD6").then(function(trans){
//     var transactions = [];
//     for(let i = 0; i < trans.data.length; i++){
//         var  message = nem.utils.convert.hex2a(
//             trans.data[i].transaction.message.payload
//         );
//         if(message.length > 100) {
//             if(IsJsonString(message)){
//                 var d = Date(); 
//                  a = d.toString() 
//                 var msg = JSON.parse(message);
//                 transaction = {
//                     batch:msg[i].batchName,
//                     sentDate:a,
//                     hash: trans.data[i].meta.hash.data
//                 }
//                 console.log(transaction)
//                 transactions.push(transaction);
//             }
//         }
//     }
//     // res.render('monitor', {transactions: transactions});      
//         }, function(err) {
//     });


// let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
// nem.com.requests.account.transactions.all(endpoint, "TARZJYIEPXABYOT3HXTLPTMAB2QMZOJWAOHWRPD6").then(function(trans){
//     var transactions = [];

//     console.log(trans.data[0].meta.hash.data);

//     for(let i = 0; i < trans.data.length; i++){
//         var  message = nem.utils.convert.hex2a(
//             trans.data[i].transaction.message.payload
//     );
        
//         if(message.length > 100) {
//             if(IsJsonString(message)){
//                 var d = Date(); 
//                 a = d.toString();

//                 transaction = {
//                     batch:msg[i].batchName,
//                     sentDate:a
//                 }
//                 transactions.push(transaction);
//             }
//         }
//     }

// }, function(err) {
// });

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


