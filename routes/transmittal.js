var express = require("express"),
    router = express(),
    multer = require('multer'),
    xlstojson = require("xls-to-json-lc"),
    xlsxtojson = require("xlsx-to-json-lc");
    var nem = require("nem-sdk").default;

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
    router.post('/transmittal', function(req, res) {
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
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, result: null});
                    }
                    //  let resultString = JSON.stringify(result);
                     let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
                    //  let common = nem.model.objects.create('common')('1234', '8f6306b7590e3b0eee6fe7e1c829580530c48f86a5eebd3acc11f994af42e939');
                    //  let transferTransaction = nem.model.objects.create('transferTransaction')('TARZJYIEPXABYOT3HXTLPTMAB2QMZOJWAOHWRPD6',1,resultString);
                    //  let preparedTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);
                    //  nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
                    //       console.log(res);
                    //   }, function(err){
                    //       console.log(err);
                    //   });

                    nem.com.requests.account.data(endpoint, "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S").then((res)=>{
                        console.log(res);
                    }, (er)=>{
                        console.log(err);
                    });

                    // nem.com.requests.chain.height(endpoint).then(function(res) {
                    //     console.log(res)
                    // }, function(err) {
                    //     console.error(err)
                    // })
                    
                     res.render('data.ejs', {results: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    });
    
module.exports = router;