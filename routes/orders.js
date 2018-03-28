var express = require('express');
var Order = require('../models/order');
var Product = require('../models/product');
var router = express.Router();


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
        Order.find({}).populate("productId").exec(function(err,result) {
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
    req.userId = '5ab8161bc0e22608af9c6ece';
    next();
});

router.post('/add', function(req, res, next) {
    if (req.userId) {
        console.log(req.body.name);
        var order = new Order({
            amount: req.body.amount,
            userId:req.userId,          
            productId: req.body.productId,
            state: 'ordered',
        })
        order.save(function(err, result){
            if (!err){
                res.json({ result: result });
            } else {
                res.status(403).json(err);
            }
        });
    } else {
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
