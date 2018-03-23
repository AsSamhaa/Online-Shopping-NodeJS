var express = require('express');
var Product = require('../models/product');

var router = express.Router();


/* get product info */
router.get('/:id?', function(req, res, next) {
    if(request.params.id){
        var id = request.params.id;
        productModel.findOne({ _id: id }, function(err, result) {
            response.json(result);
        });
    } else {
        productModel.find({}, function(err,result) {
            response.json(result);
        });
    }
});

/* add product info */
router.post('/add', function(req, res, next) {
    console.log(request.body.productName);
    var product = new productModel({
        productName :request.body.productName,
        productPrice:request.body.productPrice,
        amountAvailable:request.body.amountAvailable,
        description:request.body.productDesc,
        productImage:request.body.image,
        sellerId:request.body.sellerId
        //subcatId:
        //orderId:
        //userId:
    })
    product.save(function(err, result){
        if(!err){
            // response.send(request.body)
            response.json({result:'product added'});
        }else{
            response.json(err);
            
        }
    })
});

/* edit product info */
router.post('/edit', function(req, res, next) {
    var id = request.params.id;
    //response.send(request.body)
    console.log(request.body.productName);
    console.log(request.params.id);
    productModel.update(
        { _id: id },
        { "$set": {
                productName: request.body.productName,
                productPrice: request.body.productPrice,
                description: request.body.productDesc,
                productImage: request.body.image
            }
        },
        function(err,result) {
            if (!err) {
                response.json({result:"product edited"});
            } else {
                console.log(err)
                response.json({result:"failed to edit"});
            }
        });
});

/* delete product */
router.get('/delete/:id?', function(req, res, next) {
    if(request.params.id){
        productModel.remove({_id:request.params.id},function(err,data){
            if(!err){
                response.json({result:"deleted"});
            }else{
                response.status(404).json({result:'Not found'});
            } 
         })    
    }else{
        response.status(404).json({result:'Not found'});
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
