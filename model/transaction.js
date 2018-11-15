var mongoose = require("mongoose");

var transactionSchema = mongoose.Schema({
    address: String,
    tracking: String,
    name: String,
    nemaddress: String,
    batchName: String,
    user: {
        id: {
            type :mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Transaction", transactionSchema);