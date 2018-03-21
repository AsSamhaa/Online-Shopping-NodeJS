var mongoose = require("mongoose");
var Product = require("./product");

// ORM Mapping ...
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type:String, required: true },
  email: { type:String, required: true },
  password: { type:String, required: true },
  address: String,
  gmail: String,
  facebookMail: String,
  image: String,
  productId: { type: Schema.Types.ObjectId, ref: 'Product' }
});

// Register ...
module.exports = mongoose.model("User",userSchema);