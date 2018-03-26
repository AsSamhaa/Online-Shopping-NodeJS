var mongoose = require("mongoose");
var Category = require("./category");

// var autoIncrement = require('mongoose-auto-increment');
// var connection = mongoose.createConnection("mongodb://localhost/souq");
// autoIncrement.initialize(connection);

// ORM Mapping ...
var Schema = mongoose.Schema;

var subcategorySchema = new Schema({
  subcatName: { type: String, required: true },
  categoryId : [{ type: Schema.Types.ObjectId, ref: "Category"}],
});

// var Subcategory = connection.model('subcategories', subcategorySchema);
// subcategorySchema.plugin(autoIncrement.plugin, 'Subcategory');


// Register ...
module.exports = mongoose.model("Subcategory", subcategorySchema);
