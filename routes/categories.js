var express = require('express');
var Category = require('../models/category');
var Subcategory = require('../models/subcategory');
var Product = require('../models/product');
var Seller = require('../models/seller');
var router = express.Router();

/************** get category all or specific one  **********************/
router.get('/:id?', function(req, res, next) {
    if(req.params.id){
        var id = req.params.id;
        Category.findOne({ _id: id }).populate("subcategoryId").exec(function(err, result){
             if(!err){           
                console.log(result);
                res.json(result);
            }else {
                res.json(err);
            }
        }); 
    } else {
        Category.find({}).populate("subcategoryId").exec(function(err,result) {
        if(!err){ 
            res.json(result);
        }else {
            res.json(err);
              }
        });
    }
});
/******************** add Category info ......*************/
router.post('/add', function(req, res, next) {
    // if (req.isAuthenticated) {
    //     // statement
    // }
    console.log(req.body.name);
    var cat = new Category({
        categoryName: req.body.name,
        subcategoryId: req.body.id,
    })
    cat.save(function(err, result){
        if(!err){
            // res.send(req.body)
            res.json({result:'Category added'});
        }else{
            res.json(err);
        }
    })
})
//*************************  add subCats  *******************************//
router.post('/addsub', function(req, res, next) {
    // if (req.isAuthenticated) {
    //     // statement
    // }
    console.log(req.body.name);
    var subcat = new Subcategory({
        subcatName: req.body.name,
        // categoryId: req.body.id,
    })
    subcat.save(function(err, result){
        if(!err){
            // res.send(req.body)
            res.json({result:'subCategory added'});
        }else{
            res.json(err);
        }
    })
})


//*************show subcategories of specific category*****************// 
router.get('/:id/showsubs',function(req,res,next){
    console.log("in nnn");
    if(req.params.id){
        var id = req.params.id;
        console.log("in");
        Subcategory.find({categoryId:id},function(err, result) {
            if(!err){
                console.log("no error");
                res.json(result);
            }else{
                res.json(err);
            }
        });
    }else{
        Subcategory.find({}, function(err,result) {
        res.json(result);
        });
    }
});
//*********************show products of specific subcategory ****************//
// show products of a specific subcategory
/*!!!!!!!!!!!!!!
 * to turn nested callbacks into promises
 * to reduce the array of products and truncate some sensitive fields
 * to change the pagination method from 'skip' and 'limit' to range based
 * need to change the ref field for Seller from sellerId to seller
*/
router.get('/subcat/:id/:page?', function(req, res, next) {
    Subcategory.findOne({ _id: req.params.id }, function(err, subcat) {
        var prodPerPage = 3;
        if (!err && subcat != null) {
            Product.find({ subcatId: req.params.id }).
            skip(((req.params.page ? req.params.page : 1) - 1) * prodPerPage).
            limit(prodPerPage).
            exec(function(err, products) {
                if (!err) {
                    Product.find({ subcatId: req.params.id }).
                    count().
                    exec(function(err, count) {
                        if (!err) {
                            Seller.populate(products, { path: 'sellerId', },
                                (err, modProducts) => {
                                    if (!err) {
                                        objToSend = {}
                                        objToSend[subcat.name] = modProducts;
                                        objToSend.pages = Math.ceil(count / prodPerPage);
                                        res.json({ result: objToSend });
                                    } else {
                                        res.status(404).json(err);
                                    }
                                });
                        } else {
                            res.status(404).json(err);
                        }
                    });
                } else {
                    res.status(404).json(err);
                }
            });
        } else {
            res.status(404).json(err);
        }        
    });
});
//*********************show products of specific category ****************//

//**********************Seller Shelf *******************************//
router.get('/warehouse', function(req, res, next) {
    // console.log("here");
    Product.find({sellerId:req.userId}, function(err, result) {
            // console.log("hi");
            res.json(result); });
});

router.get('/search/:search/:page', function (req, res, next) {
    var catPerPage = 3;
    Category.find({categoryName :{$regex:req.params.search}}).skip((req.params.page - 1) * catPerPage).limit(catPerPage).exec(function (err, result) {
        if (!err) {
            Category.find({
                name: {
                    $regex: req.params.search
                }
            }).count().exec(function (err, count) {
                res.json({
                    categories: result,
                    pages: Math.ceil(count / catPerPage)
                })
            })
        } else {
            res.json(err);
        }
    })
});


// notice here you get the seller id from request ===>>tested
module.exports = router;
