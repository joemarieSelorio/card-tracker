var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    address: String,
    publicKey: String,
    privateKey: String,
    isAdmin: {type: Boolean, default: false},
    transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }       
    ],
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", UserSchema);

