var mongoose = require("mongoose");
var Product = require("./product");

// ORM Mapping ...
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type:String, required: true },
  email: { type:String, required: true, unique: true},
  password: { type:String },
  address: String,
  image: String,
  socialId: String,
  accessToken: String,
  revProductId: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

// Register ...
module.exports = mongoose.model("User",userSchema);