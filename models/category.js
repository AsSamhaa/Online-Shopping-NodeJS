var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/souq");
autoIncrement.initialize(connection);


// ORM Mapping ...
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  categoryName: { type: String, required: true },
});


var Category = connection.model('categories', categorySchema);
categorySchema.plugin(autoIncrement.plugin, 'Category');

// Register ...
module.exports = mongoose.model("Category", categorySchema);
