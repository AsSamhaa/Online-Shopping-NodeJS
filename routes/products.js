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
// get single product info
// need to add pagination
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
    if (req.userId != product.sellerId) {
        delete product.sellerId;
        delete product.orderId;
        delete product.userId;
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});

/* add product info */
router.post('/add', function(req, res, next) {
    if (req.isAuthenticated) {
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

/* edit product info */
router.post('/edit', function(req, res, next) {
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

/* delete product */
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


module.exports = router;
