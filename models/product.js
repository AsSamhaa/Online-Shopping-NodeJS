var mongoose = require("mongoose");
var Seller = require("./seller");
var Subcategory = require("./subcategory");
var Order = require("./order");
var User = require("./user");
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/souq");
autoIncrement.initialize(connection);


// ORM Mapping ...
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amountAvailable: { type: Number, required: true },
  description: { type: String, required: true },
  image: String,
  sellerId : { type: Schema.Types.ObjectId, ref: "Seller" },
  subcatId: { type: Schema.Types.ObjectId, ref: "Subcategory" },
  orderId: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
var Product = connection.model('products', productSchema);
productSchema.plugin(autoIncrement.plugin, 'Product');

// Register ...
module.exports = mongoose.model("Product", productSchema);
