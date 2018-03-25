var mongoose = require("mongoose");
var Seller = require("./seller");
var Subcategory = require("./subcategory");
var Order = require("./order");
var User = require("./user");


// ORM Mapping ...
var Schema = mongoose.Schema;

var rateSchema = new Schema ({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  rate: { type: Number, required: true },
});

var productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amountAvailable: { type: Number, required: true },
  description: { type: String, required: true },
  image: String,
  avgRate: Number,
  sellerId : { type: Schema.Types.ObjectId, ref: "Seller" },
  subcatId: { type: Schema.Types.ObjectId, ref: "Subcategory" },
  orderId: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  ratings: [rateSchema]
});

// Register ...
module.exports = mongoose.model("Product", productSchema);
