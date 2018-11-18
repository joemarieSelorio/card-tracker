var express = require("express"),
    router = express(),
    multer = require('multer'),
    xlstojson = require("xls-to-json-lc"),
    xlsxtojson = require("xlsx-to-json-lc");
    var nem = require("nem-sdk").default;
    var middleware = require("../middleware");
    Transaction = require("../model/transaction")

function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
}
//MULTER
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});


var upload = multer({ //multer settings
        storage: storage,
            fileFilter : function(req, file, callback) { //file filter
            if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                    return callback(new Error('Wrong extension type'));
                }
                    callback(null, true);
            }
}).single('file');

/** API path that will upload the files */
    router.post('/transmittal/upload', middleware.isLoggedIn, function(req, res) {
        console.log(req.body.batch);
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the routerropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,data){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    }
                    for (let i = 0; i < data.length; i++) {
                        let rb32 = nem.crypto.nacl.randomBytes(32);
                        let pkey = nem.utils.convert.ua2hex(rb32);
                        let keyPair = nem.crypto.keyPair.create(pkey);
                        var publicKey = keyPair.publicKey.toString();
                        var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id);
                        data[i].nemaddress = address; 
                        data[i].batchName = req.body.batch;
                        data[i].status = 'To be verified';

                    var user = {
                        id: req.user._id,
                        username: req.user.username
                    }
                }
                router.post('/transmittal/send',function(req, res){
                    var array = [];
                    for(let i = 0; i < data.length; i++){
                         var transmittal = {
                            batchName: data[i].batchName,
                            tracking: data[i].tracking,
                            name: data[i].name,
                            address: data[i].address,
                            status: data[i].status
                         }
                         var transmittalData = {
                            tracking: data[i].tracking,
                            nemaddress: data[i].nemaddress,
                            status: data[i].status 
                         }

                         Transaction.update(
                            {tracking: transmittal.tracking}, 
                            {$setOnInsert: transmittalData}, 
                            {upsert: true}, 
                            function(err, numAffected) {
                                console.log(numAffected);
                             }
                        );

                        array.push(transmittal);
                        var sendFile = JSON.stringify(array);
                        if(i === data.length-1){
                           middleware.send('55105eeff245f5f2fde0946fcd84d345690fca230c44bba5d6303f40a78c9ad1',
                           '12345',
                           'TD5XSW4MS2PW2ZCBHAMAEPRL5OSA4OUSCIBY2EPP',
                           sendFile
                           );
                        }
                    }
                    res.redirect('/main');
                 });
      
                 res.render('send', {data: data});
        });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    });

router.get('/monitor', function(req, res){
    var user = req.user;
    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    nem.com.requests.account.transactions.all(endpoint, user.address).then(function(trans){
        var transactions = [];
        for(let i = 0; i < trans.data.length; i++){
            if(trans.data[i].transaction.message){
            var  message = nem.utils.convert.hex2a(
                trans.data[i].transaction.message.payload
            );
            if(message.length > 100) {
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
        res.render('monitor', {transactions: transactions, user: user});      
            }, function(err) {
        });
});

router.get('/unverified', function(req, res){
    var user = req.user;
    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    nem.com.requests.account.transactions.all(endpoint, user.address).then(function(trans){
        var transactions = [];

        for(let i = 0; i < trans.data.length; i++){
        if(trans.data[i].transaction.message){
            var  message = nem.utils.convert.hex2a(
                trans.data[i].transaction.message.payload
            );
            if(message.length > 100) {
                if(IsJsonString(message)){
                if(trans.data[i]){
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
        res.render('monitor', {transactions: transactions, user: user});      
            }, function(err) {
        });
});

router.post('/transmittal/monitor', function(req, res){
   var hash = req.body.hash;
   let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
   nem.com.requests.transaction.byHash(endpoint, hash).then(function(trans){
    if(trans.data[i].transaction.message){
               var  message = nem.utils.convert.hex2a(
                   trans.transaction.message.payload
               );
            var transactions = JSON.parse(message);
            res.render('view', {transactions: transactions});
               }
            });
            
        }, function(err){
   });

module.exports = router;