var mongoose = require("mongoose");
var User = require("./user");
var Product = require("./product");
var Seller = require("./seller");
// ORM Mapping ...
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    orderDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    state: {
        type: String, required: true,
        enum: ['ordered', 'delivered', 'available'],
        default: 'available'
    }
});

// Register ...
module.exports = mongoose.model("Order", orderSchema);
