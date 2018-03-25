var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/souq");
autoIncrement.initialize(connection);
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

var Seller = connection.model('sellers', sellerSchema);
sellerSchema.plugin(autoIncrement.plugin, 'Seller');

// Register ...
module.exports = mongoose.model("Seller",sellerSchema);
