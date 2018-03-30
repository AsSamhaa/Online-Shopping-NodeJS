var express = require('express');
var Product = require('../models/product');
var Subcategory = require('../models/subcategory');
var Category = require('../models/category');
var Order = require('../models/order');
var Seller = require('../models/seller');
var router = express.Router();

router.use((req, res, next) => {
    // req.userId = '5ab80499821daa065d66ea0f';
    next();
});

// to get trending products
router.get('/trend', function(req, res, next) {
    console.log('hiiiiiiiiiiiiii');
    Order.aggregate([
        { $match: { orderDate: { $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30) } } },
        { $group: { 
            _id: '$productId',
            ordersSum: { $sum: '$amount' },
        } },
        { $sort: { ordersSum: -1 } },
        { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'prodPopArr'
        } },
        { $replaceRoot: {
            newRoot:
                { $arrayElemAt: [ '$prodPopArr', 0 ] }
        } },
        { $limit: 10 },
    ]).exec(
        function (err, products) {
            if (!err) {
                res.json({
                    result: products
                });
            } else {
                res.status(404).json(err);
            }
        });
});
// get single product info
router.get('/get/:id', function(req, res, next) {
    Product.findOne({ _id: req.params.id }, { orderId: 0, ratings: 0 }, function(err, product) {
        if (!err) {
            if (product) {
                Seller.populate(product, { path: 'sellerId' }, (err, modProduct) => {
                    if (!err) {
                        res.json({ result: modProduct });
                    } else
                    res.status(400).json({ error: err.message });
                });
            } else {
                res.status(404).json({ error: 'product is not found' });
            }
        } else
            res.status(400).json({ error: err.message });
    });
});

/*
    dummyObj = {
        search: 'gsgsdgsd',
        subcatsIds: [],
        min: 343,
        max: 434
    }
*/
// get filtered products
router.post('/get', function(req, res, next) {
    filterOpts = {};
    filterOpts.price = {};
    filterOpts.price.$gte = req.body.min ? req.body.min : 0;
    if (req.body.search)
        filterOpts.name = { $regex: req.params.regex };
    if (req.body.subcatIds.length != 0)
        filterOpts.subcatId = { $in: req.body.subcatIds };
    if (req.body.max)
        filterOpts.price.$lte = req.body.max;
    Product.find(filterOpts, { orderId: 0, ratings: 0 }, function(err, products) {
        if (!err) {
            if (products) {
                Seller.populate(products, { path: 'sellerId' }, (err, modProducts) => {
                    if (!err) {
                        res.json({ result: modProducts });
                    } else
                        res.status(400).json({ error: err.message });
                });
            } else {
                res.status(404).json({ error: 'not found' });
            }
        } else
            res.status(400).json({ error: err.message });
    });
});

/************************ add product info ************************/
// validation is conducted via hooks in the model file
router.post('/add', function(req, res, next) {
    if (req.isSeller) {
        console.log(req.body.name);
        var product = new Product({
            name: req.body.name,
            price: req.body.price,
            amountAvailable: req.body.amountAvailable,
            description: req.body.description ? req.body.description : '',
            image: req.body.image,
            sellerId: req.userId,
            subcatId: req.body.subcategory,
        });
        product.save(function (err, result) {
            if (!err) {
                res.json({ result: 'product added' });
            } else {
                res.status(403).json({ error: err.message });
            }
        });
    } else
        res.status(403).json({ error: 'not authorized'});
});

/************************* edit product info **************************8*/
// id in the url should be in the body as hidden input
router.post('/edit/:id', function(req, res, next) {
    if (req.isSeller) {
        Product.update(
            { _id: req.params.id },
            { $set: {
                name: req.body.name,
                price: req.body.price,
                amountAvailable: req.body.amountAvailable,
                description: req.body.description,
                image: req.body.image
            } },
            function(err, result) {
                if (!err) {
                    res.json({ result: "product edited" });
                } else
                    res.status(400).json({ error: err.message });
        });
    } else
        res.status(403).json({ error: 'not authorized' });
});

// to rate a product
router.post('/rate/:id', function(req, res, next) {
    // to check user rating not to fall out of range
    if (req.userId) {
        req.body.rate = (req.body.rate >= 0 && req.body.rate <= 5) ? req.body.rate : 0;
        Product.findOne(
        { _id: req.params.id },
        function(err, product) {
            if (!err) {
                if (product) {
                    var prevRating = false;
                    for (rating of product.ratings) {
                        if (rating.userId == req.userId) {
                            prevRating = rating;
                            break;
                        }
                    }
                    Product.bulkWrite([
                        { updateOne: {
                            filter: { _id: req.params.id },
                            update: {
                                $inc: { 
                                    sumOfRates: 
                                        prevRating ?
                                        (req.body.rate - prevRating.rate) :
                                        req.body.rate,
                                    ratesCounter: prevRating ? 0 : 1
                                },
                                $pull: { ratings: { userId: req.userId } }
                            }
                        } },
                        { updateOne: {
                                filter: { _id: req.params.id },
                                update: {
                                    $addToSet: {
                                        ratings: {
                                            userId: req.userId,
                                            rate: req.body.rate
                                        }
                                    }
                                }
                        } }
                    ]).then(function(err, result) {
                        if (!err) {
                            res.json({ result: 'product rated' });
                        } else {
                            res.status(400).json({ error: err.message });
                        }
                    });
                } else {
                    res.status(404).json({ error: 'product not found' });
                }
            } else {
                res.status(404).json({ error: err.message });
            }
        });
    } else
        res.status(403).json({ error: 'not authenticated' });
});

// to get trending products
router.get('/trend', function(req, res, next) {
    console.log('hiiiiiiiiiiiiii');
    Order.aggregate([
        { $match: { orderDate: { $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30) } } },
        { $group: { 
            _id: '$productId',
            ordersSum: { $sum: '$amount' },
        } },
        { $sort: { ordersSum: -1 } },
        { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'prodPopArr'
        } },
        { $replaceRoot: {
            newRoot:
                { $arrayElemAt: [ '$prodPopArr', 0 ] }
        } },
        { $limit: 10 },
    ]).exec(
        function (err, products) {
            if (!err) {
                res.json({
                    result: products
                });
            } else {
                res.status(404).json({ error: err.message });
            }
        });
});

/************************* delete product ********************************/
router.get('/delete/:id?', function(req, res, next) {
    if (req.isSeller) {
        if (req.params.id) {
            Product.findOne({ _id: req.params.id, sellerId: req.userId }, (err, product) => {
                if (!err && product) {
                    Product.remove({ _id: req.params.id }, function(err, data) {
                        if (!err) {
                            res.json({ result: 'deleted' });
                        } else
                            res.status(404).json({ error: 'Not found'});
                    });
                } else
                    res.status(404).json({ error: err.message ? err.message : 'not found' });
            })
        } else
            res.status(403).json({ error: 'bad request parameters'});
    } else
        res.status(403).json({ error: 'Not Authenticated'});
});

//******************************Seller Shelf ***************************//
router.get('/stock/:userId/:page', function (req, res, next) {
    // sellerId = req.params.id;
    var prodPerPage = 2;
    Product.find({
        sellerId: req.params.userId
    }).skip((req.params.page - 1) * prodPerPage).limit(prodPerPage).exec(function (err, result) {
        if (!err) {
            Product.find().count().exec(function (err, count) {
                res.json({
                    products: result,
                    pages: Math.ceil(count / prodPerPage)
                });
            })
        } else {
            res.json(err);
        }
    });
});

module.exports = router;