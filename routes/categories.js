var express = require('express');
var Category = require('../models/category');
var Subcategories = require('../models/subcategory');
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
    var subcat = new Subcategories({
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
        Subcategories.find({categoryId:id},function(err, result) {
            if(!err){
                console.log("no error");
                res.json(result);
            }else{
                res.json(err);
            }
        });
    }else{
        Subcategories.find({}, function(err,result) {
        res.json(result);
        });
    }
});
//*********************show products of specific subcategory ****************//




//*********************show products of specific category ****************//



module.exports = router;
