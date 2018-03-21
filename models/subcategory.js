var mongoose = require("mongoose");

// ORM Mapping ...
var Schema = mongoose.Schema;

var subcategorySchema = new Schema({
  subcatId: { type: Number, required: true },
  subcatName: { type: String, required: true },
  categoryName: { type: String, required: true },
});

// Register ...
module.exports = mongoose.model("Subcategory", subcategorySchema);
