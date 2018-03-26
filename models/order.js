var mongoose = require("mongoose");
var User = require("./user");
var Seller = require("./seller");
var Product = require("./product");


// ORM Mapping ...
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  orderDate: { type: Date,  default: Date.now,required: true },
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  state: {
    type: String, required: true,
    enum: ['ordered', 'delivered', 'available'],
    default: 'available'
  }
});




// Register ...
module.exports = mongoose.model("Order", orderSchema);
