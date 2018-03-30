var express = require('express');
var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');
var mongoose = require('mongoose');
var fawn = require('fawn');


var router = express.Router();
fawn.init(mongoose);


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

// task.update("Accounts", {firstName: "Broke", lastName: "Ass"}, {$inc: {balance: -20}})
// var Cars = mongoose.model("cars", new Schema({make: String, year: Number}));
// var toyota = new Cars({make: "Toyota", year: 2015});
 
// task.save("cars", {make: "Toyota", year: 2015});
// task.save(Cars, {make: "Toyota", year: 2015});
// task.save("cars", toyota);
// task.save(Cars, toyota);
// task.save(toyota);
router.use(function(req, res, next) {
    // req.userId = '5aba75a79b32c814c57abae2';
    // req.cartArray =[{productId:"5abd4019c938f32b83d9bd4e",amount:2},{productId:"5abd4028c938f32b83d9bd4f",amount:1  }];
    next();
});
/*router.post('/add', function(req, res, next) {
    var task = fawn.Task();
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
                productsArr.forEach(function(product, index) {
                    console.log("inside for each  ",quantitiesArr);
                    Product.findOne({ _id: product }, function (err, foundProd) {
                        console.log("quantitiesArr ",quantitiesArr[index]);

                        // console.log("res ",foundProd);
                        if (!err && foundProd.amountAvailable >= quantitiesArr[index]) {
                            console.log("in update")
                            task.save('Order', new Order({
                                amount: quantitiesArr[index],
                                userId: req.userId,
                                productId: product,
                                state: 'ordered',
                            }));
                            task.update(
                                'products',
                                { _id: product },
                                { $inc: { amountAvailable: -1 * quantitiesArr[index] } });
                        } else {
                            console.log("error ",err);
                            console.log("else cond")
                            error = err ?
                            err.message :
                            'order of more than available of ' + foundProd.name;
                        }
                           
                    });
                });
                if (error.length == 0) {
                    console.log("hi")
                    task.run({ useMongoose: true }).
                    then(function(results) {
                        User.update(
                            { _id: req.userId }, 
                            { $pull: { cart: { $nin: [] } } },
                            (err, result) => {
                                if (!err) {
                                    res.json({ results: 'success' });
                                } else
                                    res.status(500).json(
                                        { error: 'order added, but can not empty cart' });
                            });
                    }).catch(function(err) {
                        res.status(400).json({ error: 'can not add commit order' });
                    });
                } else
                    res.status(400).json({ error: error });
            } else
                res.status(400).json({ error: err.message ?
                    err.message : 'seller accounts can not conduct purchases' });
        });
    }
});*/

// just for testing 
router.use(function(req, res, next) {
    // req.userId = '5aba75a79b32c814c57abae2';
    // req.cartArray =[{productId:"5abd4019c938f32b83d9bd4e",quantity:2},{productId:"5abd4028c938f32b83d9bd4f",quantity:1  }];
    next();
});

router.post('/add', function(req, res, next) {
    
        // var flag=true;
        //     User.findOne({_id:req.userId},function(err, user){
        //         for (var i = 0; i < user.cart.length; i++) {
        //              Product.findOne({ _id: user.cart[i].productId }, function(err, result) {
        //                 if(user.cart[i].quantity>result.amountAvailable){
        //                     flag=false;
        //                 }
        //             })
        //         }
        //     })
    if (req.userId) {
        User.findOne({_id:req.userId},function(err, user){
            user.cart.forEach((element, index,failedorders) => {
                Product.findOne({ _id: element.productId }, function(err, result) {
                    if (!err) {
                        if (element.quantity <= result.amountAvailable) {
                            var order = new Order({
                                amount: element.quantity,
                                userId:req.userId,          
                                productId: element.productId,
                                state: 'ordered',
                            });
                            order.save(function(err,result){
                            if (!err){
                                console.log(element.productId);
                                console.log(element.quantity);
                                Product.updateOne(
                                    { _id: element.productId },
                                    { '$inc': {amountAvailable: -1 * element.quantity }},function(err,result){
                                        User.update(
                                            { _id: req.userId }, 
                                            { $pull: { cart: { $nin: [] } } },
                                                function (err, result) {
                                                    if (!err) {
                                                    console.log("Clear Cart");
                                                    console.log("success");
                                                            } else {
                                                                res.status(400).json(err); 
                                                            }
                                                })
                                });
                            }else {
                                res.status(403).json(err);
                            }
                        })
                    }else{
                        console.log("requested amount above amount Available");
                    }
                }else{
                    // res.json(error:"error");
                    console.log(err)
                }
            })
        })            
        res.json({ result: "added orders -- products amount updated" });
    });  
    }else {
        res.status(403).json({ result: 'user is not authenticated' });
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
