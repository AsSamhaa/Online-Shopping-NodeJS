var mongoose = require("mongoose");
var Seller = require("./seller");
var Subcategory = require("./subcategory");
var Order = require("./order");
var User = require("./user");


// ORM Mapping ...
var Schema = mongoose.Schema;

var rateSchema = new Schema ({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rate: { type: Number, required: true },
}, { _id: false });

var productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    amountAvailable: { type: Number, required: true },
    description: { type: String, required: true },
    image: String,
    sumOfRates: Number,
    ratesCounter: Number,
    sellerId : { type: Schema.Types.ObjectId, ref: "Seller" },
    subcatId: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    orderId: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    ratings: [rateSchema]
});

productSchema.pre('update', function(next) {
    var updateObj = this.getUpdate().$set;
    if (updateObj.price <= 0.5) updateObj.price = 0.5;
    if (updateObj.amountAvailable < 0) updateObj.amountAvailable = 0;
    if (updateObj.description.length == 0) updateObj.description = 'no description available';
    if (updateObj.name.length == 0)
        next(new Error('name is required'));
    else
        next();
});

productSchema.pre('save', function(err, next) {
    if (this.price <= 0.5) this.price = 0.5;
    if (this.amountAvailable < 0) this.amountAvailable = 0;
    if (this.description.length == 0) this.description = 'no description available';
    if (this.name.length == 0)
        next(new Error('name is required'));
    else
        next();
});

// Register ...
module.exports = mongoose.model("Product", productSchema);
