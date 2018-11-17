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
                        data[i].batchName = 'batch 1'
                        var status = data[i].status = 'To be verified';

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
                            nemaddress: data[i].nemaddress,
                            name: data[i].name,
                            address: data[i].address,
                            status: data[i].status
                         }
                        array.push(transmittal);
                        if(i === data.length-1){
                            var sendFile = JSON.stringify(array);
                           middleware.send('93717a4a04d48af658de7e96e31fdc48ba46d4888b6bd1d2f140d59e0479ba02',
                           '12345',
                           'TAVLKRJNGA43QPF7TATJNYR3KC7KNPUPUA72IQ3R',
                           sendFile
                           );
                        }
                    }
                 });

        res.render('monitor', {data: data});

        });

    
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    });

router.get('/transmittal/monitor', function(req, res){
        let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
        nem.com.requests.account.transactions.all(endpoint, "TARZJYIEPXABYOT3HXTLPTMAB2QMZOJWAOHWRPD6").then(function(trans){
            for(let i = 0; i < trans.data.length; i++){
                var  message = nem.utils.convert.hex2a(
                    trans.data[i].transaction.message.payload
                );
                if(message.length > 100) {
                    if(IsJsonString(message)){
                        var msg = JSON.parse(message);
                        if(msg[i].status === 'To be verified'){
                            var d = Date(Date.now()); 
                            var dateNow = d.toString();
                            var transactionObj = {
                                batchName: msg[i].batchName,
                                sent: dateNow
                            }
                            var transactions = [];
                            transactions.push(transactionObj);
                            if(i === transactions.length -1){
                                res.render('monitor', {transactions: transactions});
                            }
                        }
                    }
                }
            }
        }, function(err) {
    });
});

module.exports = router;