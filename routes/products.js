var express = require('express');
var router = express.Router();
var Product = require('../models/product');


// /* get product info */
// router.get('/:id?', function(req, res, next) {

// });

/* add product info */
router.get('/add', function(req, res, next) {
    console.log('hi');
    product = new Product({ 
        name: 'iphone',
        price: 1000,
        amountAvailable: 4,
        description: 'expensive',
    });
    product.save().then(() => {res.send('done')});
});

/* add product info */
router.post('/add', function(req, res, next) {

});

/* edit product info */
router.post('/edit', function(req, res, next) {

});

/* delete product */
router.get('/delete/:id?', function(req, res, next) {

});


module.exports = router;
