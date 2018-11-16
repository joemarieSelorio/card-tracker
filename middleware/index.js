var User = require('../model/user');
var middlewareObj = {

};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

middlewareObj.send = function (privateKey, password, receiverAdd, message) {
    var nem = require('nem-sdk').default;
    let endpoint = nem.model.objects.create("endpoint")("http://23.228.67.85", 7890);
    let common = nem.model.objects.create('common')
            (password, privateKey);
    let transferTransaction = nem.model.objects.create('transferTransaction')
        (receiverAdd, 0, message);
    let preparedTransaction = nem.model.transactions.prepare
        ('transferTransaction')
            (common, transferTransaction, nem.model.network.data.testnet.id);
    nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
        console.log(res);
    }, function(err){
        console.log(err);
    });
 }

module.exports = middlewareObj