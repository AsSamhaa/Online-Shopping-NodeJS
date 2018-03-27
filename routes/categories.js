var express = require('express');
var Category = require('../models/category');
var Subcategory = require('../models/subcategory');
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
*/
router.get('/subcat/:id', function(req, res, next) {
    subcatProductsObj = {}
    Subcategory.findOne({ _id: req.params.id }, function(err, subcat) {
        if (!err && subcat != '') {
            console.log('subcat ', subcat);
            subcatProductsObj[subcat.name] = [];
            Product.find({ subcatId: req.params.id }, function(err, products) {
                if (!err) {
                    subcatProductsObj[subcat.name] = products;
                    res.json({ result: subcatProductsObj });
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


// notice here you get the seller id from request ===>>tested
module.exports = router;
