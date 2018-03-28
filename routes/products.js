var express = require('express');
var Product = require('../models/product');
var Subcategory = require('../models/subcategory');
var Order = require('../models/order');
var router = express.Router();


router.use((req, res, next) => {
   req.userId = '5ab80499821daa065d66ea0f';
   next();
});

// get single product info
/* + need to add pagination */
// router.get('/:id', function(req, res, next) {
//     var product;
//     Product.findOne({ _id: req.params.id }, function(err, result) {
//         if (!err) {
//             product = result;
//             res.json(result );
//         } else
//             res.json(err);
//     })
// //     // to remove sensitive data if user is not the seller of the product
// //     // product.sellerName = product.sellerId.populate().name;
// //     // product.subcatName = product.subcatId.populate().name;
// //     // if (req.userId != product.sellerId) {
// //     //     delete product.subcatId;
// //     //     delete product.sellerId;
// //     //     delete product.orderId;
// //     //     delete product.userId;
// //     // } else
// //     //     res.status(403).json({ result: 'user is not authenticated' });
// });

/************************ add product info ************************/
router.post('/add', function(req, res, next) {
    if (req.userId) {
        console.log(req.body.name);
        var product = new Product({
            name: req.body.name,
            price: req.body.price,
            amountAvailable: req.body.amountAvailable,
            description: req.body.description,
            image: req.body.image,
            sellerId: req.body.sellerId,
            subcatId: req.body.subcategory,
            //orderId:
            //userId:
        });
        product.save(function(err, result){
            if (!err) {
                res.json({result: 'product added'});
            } else {
                res.json(err);
            }
        });
    } else {
        res.status(403).json({ result: 'You don\'t have enough permissions'});
    }
});

/************************* edit product info **************************8*/
router.post('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    //res.send(req.body)
    console.log(req.body)
    console.log(req.body.name);
    console.log(req.params.id);
    Product.update(
        { _id: id },
        { "$set": {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.body.image
            }
        },
        function(err,result) {
            if (!err) {
                res.json({result:"product edited"});
            } else {
                console.log(err)
                res.json({result:"failed to edit"});
            }
        });
});

// to rate a product
router.post('/rate/:id', function(req, res, next) {
    Product.findOne(
        { _id: req.params.id },
        function(err, product) {
            if (!err) {
                // the rating is found
                if (product) {
                    prevRating = {}
                    for (rating of product.ratings) {
                        if (rating.userId == req.userId) {
                            // exctracted the use rating and saved to prevRating
                            prevRating = rating.rate;
                            break;
                        }
                    }
                    console.log("My rating",req.body.rate)
                    console.log("My prev rating",prevRating)
                    prevRating=0;
                    Product.bulkWrite([
                        {   
                            updateOne: {
                                filter: { _id: req.params.id },
                                update:
                                {
                                    $inc: { 
                                        sumOfRates: 
                                            prevRating ?
                                            (req.body.rate - prevRating.rate) :
                                            req.body.rate,
                                        ratesCounter: prevRating ? 0 : 1
                                    },
                                    $pull: { ratings: { userId: req.userId } }
                                }
                            }
                        },
                        {
                            updateOne: {
                                filter: { _id: req.params.id },
                                update:
                                {
                                    $addToSet: {
                                        ratings: { userId: req.userId, rate: req.body.rate }
                                    }
                                }
                            }
                        }
                    ]).then(function(err, result) {
                        if (!err) {
                            //check for condition as conditions are reversed
                            res.json({ result: 'product rated' });
                        } else {
                            res.status(500).json(err);
                        }
                    });
                } else {
                    res.status(404).json({ result: 'product not found' });
                }
            } else {
                res.status(404).json(err);
            }
        });
});

// to get trending products
router.get('/trend', function(req, res, next) {
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
        function(err, products) {
            if (!err) {
                res.json({ result: products });
            } else {
                res.status(404).json(err);
            }
        });
});

/************************* delete product ********************************/
router.get('/delete/:id?', function(req, res, next) {
    if(req.params.id){
        Product.remove({ _id: req.params.id }, function(err,data) {
            if (!err) {
                res.json({result:"deleted"});
            } else {
                res.status(404).json({result:'Not found'});
            } 
        });
    } else {
        res.status(404).json({result:'Not found'});
    }
});

//*********text search for specific product ************************//
router.post('/search', function(req, res, next) {
    Product.find({name :{$regex:req.body.search}},function(err, result){
        if(!err){
            res.json(result);
        }else {
            res.json(err);
        }
    })
});
//******************************Seller Shelf ***************************//
router.get('/stock/:userId', function(req, res, next) {
    // console.log("here");
    // sellerId = req.params.id;
    Product.find({sellerId:req.params.userId}, function(err, result) {
        if(!err){
            res.json(result);
        }else {
            res.json(err);
        }
    });
});

module.exports = router;
