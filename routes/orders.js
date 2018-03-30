var express = require('express');
var Order = require('../models/order');
var Product = require('../models/product');
var router = express.Router();



//*******************************Show Seller Orders ****************************//
router.get('/sellerorders/:id?/:page?',function(req, res, next) {
    console.log("111 in ");
    var sellerorders =[];
    var prodPerPage=2
    var count;
    Order.find({}).count().exec(function(err, res){if(!err){count = res;}})
    Order.find({}).
    skip((req.params.page-1)*prodPerPage).
    limit(prodPerPage).
    populate({
        path:'productId',
        match:{
            'sellerId':{$eq:"5ab95e2bda28ff74357c2f03"}
        }
    }).
    exec(function(err,result) {
        console.log("222 inin ");
        if(!err){
            for (var i= 0; i < result.length; i++) {
                if (result[i].productId!=null) {
                    sellerorders.push(result[i])
                    // console.log(result);
                    console.log("333 no error");
                }
            }           
        res.json({products:sellerorders, pages:Math.ceil(count/prodPerPage)});  
        }else {
            res.json(err);
        }
    });
});
//************* get all orders or specific one and also get order products **********//
router.get('/:id?', function(req, res, next) {
    if(req.params.id){
        var id = req.params.id;
        Order.findOne({ _id: id }).populate("productId").exec(function(err, result) {
             if(!err){           
                console.log(result);
                res.json(result);
            }else {
                res.json(err);
            }
        }); 
    } else {
        Order.find({}).populate({path:"productId"}).exec(function(err,result) {
                    if(!err){ 
                res.json(result);
            }else {
                res.json(err);
            }
        });
    }
}); 
//****************************** add order *************************************//
// just for testing 
router.use(function(req, res, next) {
    // req.userId = '5aba75a79b32c814c57abae2';
    req.cartArray =[{productId:"5abd4019c938f32b83d9bd4e",amount:2},{productId:"5abd4028c938f32b83d9bd4f",amount:1  }];
    next();
});

router.post('/add', function(req, res, next) {
    if (req.userId) {
            console.log(req.cartArray.length);
            console.log("resultabove");
            // for (var i = 0; i < req.cartArray.length; i++) {
            req.cartArray.forEach((element, index) => {
                var order = new Order({
                amount: element.amount,
                userId:req.userId,          
                productId: element.productId,
                state: 'ordered',
                });
                order.save(function(err,result){
                    // console.log(element.amount);
                    if (!err){
                    console.log(element.productId);

                    console.log(element.amount);
                        Product.update(
                            { _id: element.productId },
                            { '$inc': {amountAvailable: -1 * element.amount }},function(err,result){
                                console.log("update done");
                            });
                    }else {
                        res.status(403).json(err);
                    }
                })
            })
        
            res.json({ result: "added orders -- products amount updated" });
    }else {
        res.status(403).json({ result: 'user is not authenticated' });
    }
});

//**********************   edit order state  ************************************//
router.post('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    Order.update(
        { _id: id },
        { '$set': { state: req.body.state } },
        function(err, result) {
            if (!err) {
                Product.update(
                    { _id: "5ab8e49cf23be1576d726e00" },
                    { '$inc': { amountAvailable: -1 } },
                    function(err, result) {
                        if (!err) {
                            res.json({ result: "order edited" });
                        } else {
                            console.log(err);
                            res.json({ result: "failed to edit" });
                        }
                    });
            } else {
                console.log(err)
                res.json({result:"failed to edit"});
            }
        })
});
module.exports = router;
