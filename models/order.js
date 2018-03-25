var mongoose = require("mongoose");
var User = require("./user");
var Seller = require("./seller");
var Product = require("./product");

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/souq");
autoIncrement.initialize(connection);
// ORM Mapping ...
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  orderDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  state: {
    type: String, required: true,
    enum: ['ordered', 'delivered', 'available'],
    default: 'available'
  }
});


var Order = connection.model('orders', orderSchema);
orderSchema.plugin(autoIncrement.plugin, 'Order');

// Register ...
module.exports = mongoose.model("Order", orderSchema);
