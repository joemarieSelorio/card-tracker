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
                    let Nemaddress = 'asdasd';

                    for (let i = 0; i < result.length; i++) {
                        let rb32 = nem.crypto.nacl.randomBytes(32);
                        let pkey = nem.utils.convert.ua2hex(rb32);
                        let keyPair = nem.crypto.keyPair.create(pkey);
                        var publicKey = keyPair.publicKey.toString();
                        var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id)
                      }
                      

                    res.render('data.ejs', {results: result});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    });

module.exports = router;