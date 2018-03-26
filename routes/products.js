var express = require('express');
var Product = require('../models/product');
var router = express.Router();

/* name
   price
   amountAvailable
   description
   image
   sellerId
   subcatId
   orderId
   userId
*/

router.use((req, res, next) => {
   req.userId = '5ab80499821daa065d66ea0f';
   next();
});

// get single product info
/* + need to add pagination */
router.get('/:id', function(req, res, next) {
    var product;
    Product.findOne({ _id: req.params.id }, function(err, result) {
        if (!err) {
            product = result;
        } else
            res.json(err);
    });
    // to remove sensitive data if user is not the seller of the product
    product.sellerName = product.sellerId.populate().name;
    product.subcatName = product.subcatId.populate().name;
    if (req.userId != product.sellerId) {
        delete product.subcatId;
        delete product.sellerId;
        delete product.orderId;
        delete product.userId;
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});

/************************ add product info ************************/
router.post('/add', function(req, res, next) {
    if (req.userId) {
        console.log(req.body.name);
        var product = new Product({
            name: req.body.name,
            price: req.body.price,
            amountAvailable: req.body.amountAvailable,
            description: req.body.description,
            productImage: req.body.image,
            sellerId: req.body.sellerId
            //subcatId:
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
    console.log(req.body.name);
    console.log(req.params.id);
    Product.update(
        { _id: id },
        { "$set": {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                productImage: req.body.image
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

// name
// price
// amountAvailable
// description
// image
// sumRate
// counter
// sellerId
// subcatId
// orderId
// ratings

// userId
// rate

// rate
router.post('/rate/:id', function(req, res, next) {
    var productObj = {}
    // productObj = Product.findOne({ _id: req.params.id }).where('ratings').elemMatch({ userId: req.userId });
    // Product.findOne({ _id: req.params.id }, function(err, result) {
    Product.find(/*{ _id: req.params.id }*/).
    elemMatch('ratings', { 'userId': req.userId }).
    exec(function(err, result) {
        if (!err) {
            productObj = result;
            console.log('Product.findOne ' + result);
            res.json(productObj);
            // if (productObj) {
                // productObj.populate(
                // productObj.ratings.findOne(
                //     { "userId": req.userId },
                //         // { "userId": req.userId }
                //     function(err, result) {
                //         if (!err) {
                //             console.log('populate result: ' + result);
                //             res.json({ result: result });
                //             // Product.updateOne(
                //             //     { _id: req.params.id },
                //             //     {
                //             //         $inc: { counter: 1, sumRate: req.body.rate },
                //             //         $push: {
                //             //             ratings: {
                //             //                 // to make dynamic
                //             //                 userId: req.userId,
                //             //                 rate: req.body.rate
                //             //             }
                //             //         }
                //             //     },
                //             //     function(err, result) {
                //             //         if (!err) {
                //             //             res.json({ result: "product rated" });
                //             //         } else {
                //             //             res.json(err);
                //             //         }
                //             //     });
                //         } else {
                //             res.json(err);
                //         }
                //     }
                // );
            // } else {
            //     res.json({ result: 'no such product' });
            // }
        } else {
            console.log(err);
            res.json(err);
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
router.get('/stock', function(req, res, next) {
    // console.log("here");
    Product.find({sellerId:req.userId}, function(err, result) {
        if(!err){
            res.json(result); 
        }else {
            res.json(err);
        }
    });
});

module.exports = router;
