var mongoose = require("mongoose");
var Subcategory = require("./subcategory");


// ORM Mapping ...
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  categoryName: { type: String, required: true },
  subcategoryId : [{ type: Schema.Types.ObjectId, ref: "Subcategory"}],
});



// Register ...
module.exports = mongoose.model("Category", categorySchema);
