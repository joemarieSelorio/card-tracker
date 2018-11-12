var mongoose = require("mongoose");
var courierSchema = new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    publicKey: String,
    
});
module.exports = mongoose.model("courier", courierSchema);