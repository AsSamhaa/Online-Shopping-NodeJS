var mongoose = require("mongoose");
var Product = require("./product");
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/souq");
autoIncrement.initialize(connection);

// ORM Mapping ...
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type:String, required: true },
  email: { type:String, required: true },
  password: { type:String },
  address: String,
  image: String,
  gmail: String,
  facebookMail: String,
  accessToken: String,
  refreshToken: String,
  productId: { type: Schema.Types.ObjectId, ref: 'Product' }
});

var User = connection.model('users', userSchema);
userSchema.plugin(autoIncrement.plugin, 'User');
// Register ...
module.exports = mongoose.model("User",userSchema);