var express = require('express');
var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');
var mongoose = require('mongoose');
var Transaction = require('mongoose-transactions');


// var fawn = require('fawn');
// fawn.init(mongoose);

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
router.post('/add', function(req, res, next) {
    // var task = fawn.Task();
    const transaction = new Transaction();
    if (req.userId && !req.isSeller) {
        User.findOne({ _id: req.userId }, function(err, user) {
            if (!err && user) {
                productsArr = [];
                quantitiesArr = [];
                user.cart.forEach((element) => {
                    productsArr.push(element.productId);
                    quantitiesArr.push(element.quantity);
                });
                console.log(productsArr);
                console.log(quantitiesArr);
                var error = '';
                try {
                    productsArr.forEach((product, index) => {
                        Product.findOne({ _id: product }, (err, foundProd) => {
                            if (!err && foundProd.amountAvailable >= quantitiesArr[index]) {
                                // task.save('Order', new Order({
                                transaction.insert(
                                    'Order',
                                    { amount: quantitiesArr[index],
                                        userId: req.userId,
                                        productId: product,
                                        state: 'ordered',
                                });
                                transaction.update(
                                    'Product',
                                    { _id: product },
                                    { $inc: { amountAvailable: -1 * quantitiesArr[index] } });
                            } else
                                error = err ?
                                err.message :
                                'order of more than available of ' + foundProduct.name;
                        });
                    });
                    if (error.length == 0) {
                        transaction.update(
                            'User',
                            { _id: req.userId }, 
                            { $pull: { cart: { $nin: [] } } });
                        transaction.run(/*{ useMongoose: true }*/);
                        res.json({ result: 'success' });
                } catch (error) {
                    transaction.rollback().catch(console.error);
                    transaction.clean();
                    res.status(400).json({ error: error });
                }
            } else
                res.status(400).json({ error :
                    (err.message ?
                        err.message :
                        'seller accounts can not conduct purchases')});
            }
        });
    }
});



    //             user.cart.forEach((element, index/*, failedorders*/) => {
    //                 Product.findOne({ _id: element.productId }, function(err, product) {
    //                     if (!err) {
    //                         console.log(element);
    //                         if (element.quantity <= product.amountAvailable) {
    //                             var order = new Order({
    //                                 amount: element.quantity,
    //                                 userId:req.userId,          
    //                                 productId: element.productId,
    //                                 state: 'ordered',
    //                             });
    //                             task.save(new Order({
    //                                 amount: element.quantity,
    //                                 userId:req.userId,          
    //                                 productId: element.productId,
    //                                 state: 'ordered',                                    
    //                             }));
    //                             // task.save(order);
    //                             task.update(Product,{ _id: element.productId },
    //                                     { '$inc': {amountAvailable: -1 * element.quantity }});
    //                             task.update(User, { _id: req.userId }, 
    //                                             { $pull: { cart: { $nin: [] } } });
    //                         }
    //                     }
    //                 });
    //             });
    //         } });
    //         task.run({useMongoose: true}).then(function(results){
    //             console.log("sucess");
    //             res.json(results);
    //         }).catch(function(err){
    //             console.log("fail") 
    //             res.json(err);

    //         });
    // } else {
        
    // }
// }});



//                     }}else {
//                             res.status(403).json(err);
//                     }


//                 })
//             })
// task.run({useMongoose: true})
//   .then(function(){

//                             order.save(function(err,result){
//                             if (!err){
//                                 console.log(element.productId);
//                                 console.log(element.quantity);
//                                 Product.updateOne(
//                                     { _id: element.productId },
//                                     { '$inc': {amountAvailable: -1 * element.quantity }},function(err,result){
//                                         User.update(
//                                             { _id: req.userId }, 
//                                             { $pull: { cart: { $nin: [] } } },
//                                                 function (err, result) {
//                                                     if (!err) {
//                                                         console.log("Clear Cart");
//                                                     console.log("success");
//                                                         key1='productName';
//                                                         key2='productAmount';
//                                                         value1=result.name;
//                                                         value2=result.amountAvailable;
//                                                         successorders.push({key1:value1,key2:value2})
//                                                             } else {
//                                                                 res.status(400).json(err); 
//                                                             }
//                                                 })
//                                 });
//                             }else {
//                                 res.status(403).json(err);
//                             }
//                         })
//                     }else{
//                         // res.json(result:"requested amount above amount Available");
//                         console.log("fail");
//                         console.log(index);
//                         console.log(result.name);
//                         console.log(result.amountAvailable);    
//                         value1=result.name;
//                         value2=result.amountAvailable;
//                         failedorders[index]={productName:value1,productAmount:value2}
//                                 // failedorders.push({key1:value1,key2:value2});
//                                 console.log(failedorders);
//                     }
//                 }else{
//                     // res.json(error:"error");
//                     console.log(err)
//                 }
//             })
//         })
            
//             console.log(successorders,failedorders)
//             res.json({"successorders":successorders,"failedorders":failedorders})
//       });  
//     }else {
//         res.status(403).json({ result: 'user is not authenticated' });
//     }
// });
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
