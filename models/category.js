var mongoose = require("mongoose");

// ORM Mapping ...
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  categoryId: { type: Number, required: true },
  categoryName: { type: String, required: true },
});

// Register ...
module.exports = mongoose.model("Subcategory", subcategorySchema);
