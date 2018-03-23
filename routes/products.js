var express = require('express');
var Product = require('../models/product');

var router = express.Router();


/* get product info */
router.get('/:id?', function(req, res, next) {
    if (req.isAuthenticated) {
        if (req.params.id) {
            var id = req.params.id;
            Product.findOne({ _id: id }, function(err, result) { res.json(result); });
        } else {
            Product.find({}, function(err,result) { res.json(result); });
        }
    } else {
        res.status(403).json({ result: 'You don\'t have enough permissions'});
    }
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
        })
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

// start editing
// var UrlEncodedParser = bodyParser.urlencoded({extended:false}); 
// var bodyParser = require("body-parser")
// var JSONParser = bodyParser.json();
// var urlEncodedParsermid = bodyParser.urlencoded();
// var mongoose = require("mongoose");
// var UserModel = mongoose.model("User");
// var multer = require("multer");
// var fileUploadMid = multer({dest:"./public/images/products"});

// router.use(function(req,resp,next){
//   resp.header("Access-Control-Allow-Origin","*");
//   resp.header("Access-Control-Allow-Headers","Content-Type");
//   resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
//   next();
// });
