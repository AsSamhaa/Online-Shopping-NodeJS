var express = require('express');
var Category = require('../models/category');
var Subcategories = require('../models/subcategory');

var router = express.Router();

/* get category all or specific one  */
router.get('/:id?', function(req, res, next) {
    if(req.params.id){
        var id = req.params.id;
        Category.findOne({ _id: id }, function(err, result) {
            res.json(result); });
    } else {
        Category.find({}, function(err,result) {
            res.json(result);
        });
    }
});



/* add Category info  */
router.post('/add', function(req, res, next) {
    // if (req.isAuthenticated) {
    //     // statement
    // }
    console.log(req.body.name);
    var cat = new Category({
        categoryName: req.body.name,
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

// add subCats
router.post('/addsub', function(req, res, next) {
    // if (req.isAuthenticated) {
    //     // statement
    // }
    console.log(req.body.name);
    var subcat = new Subcategories({
        subcategoryName: req.body.name,
        categoryId: req.body.id,
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


module.exports = router;
