var mongoose = require("mongoose");
var transactionSchema = mongoose.Schema({
    tracking: String,
    nemaddress: String,
    status: String,
    user: {
        id: {
            type :mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Transaction", transactionSchema);