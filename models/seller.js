var mongoose = require("mongoose");

// ORM Mapping ...
var Schema = mongoose.Schema;

var sellerSchema = new Schema({
  nationalId: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: String,
  image: String
});

// Register ...
module.exports = mongoose.model("Seller",sellerSchema);
