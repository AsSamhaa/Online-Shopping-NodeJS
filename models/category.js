var mongoose = require("mongoose");

// ORM Mapping ...
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  categoryName: { type: String, required: true },
});

// Register ...
module.exports = mongoose.model("Category", categorySchema);
