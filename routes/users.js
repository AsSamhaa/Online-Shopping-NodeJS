var express = require('express');
var fs = require("fs");
var validator = require("validator");
var User = require('../models/user');
var Seller = require('../models/seller');
var Product = require('../models/product');

var router = express.Router();

router.use((req, res, next) => {
    req.userId = '5ab80499821daa065d66ea0f';
    next();
});

// get user info
router.get('/', function(req, res, next) {
    if (req.userId) {
    	User.find({ _id: req.userId }, { password: 0 }, function(err, result) {
            if (!err) {
                res.json({ result: result });
            } else {
                res.json(err);
            }
    	});
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});

// add user info
router.post('/add', function(req, res, next) {
    var userObj = {}
        var validationResult = validator.isAlpha(req.body.name) &&
            validator.isEmail(req.body.email) &&
            validator.isLength(req.body.password, { min: 8 });

        if (validationResult) {
            userObj.name = req.body.name;
            userObj.email = req.body.email;
            userObj.password = req.body.password;
            if (req.body.image) {
                userObj.image = req.body.image;
            }
            var user = new User(userObj);
            user.save(function(err, result) {
                if (!err) {
                    res.json({ result: 'user added' });
                } else
                    res.status(400).json(err);
            });
        } else {
           res.status(400).json(err);
        }
});

// add seller info
router.post('/add_seller', function(req, res, next) {
    var sellerObj = {}
        var validationResult = validator.isAlpha(req.body.name) &&
            validator.isEmail(req.body.email) &&
            validator.isLength(req.body.password, { min: 8 }) &&
            validator.matches(req.body.nationalId, new RegExp(
                '(2|3)[0-9][1-9][0-1][1-9][0-3][1-9]' +
                '(01|02|03|04|11|12|13|14|15|16|17|18|19|21|' +
                '22|23|24|25|26|27|28|29|31|32|33|34|35|88)\\d\\d\\d\\d\\d'));

        if (validationResult) {
            sellerObj.name = req.body.name;
            sellerObj.email = req.body.email;
            sellerObj.password = req.body.password;
            sellerObj.nationalId = req.body.nationalId;
            if (req.body.image) {
                sellerObj.image = req.body.image;
            }
            var seller = new Seller(sellerObj);
            seller.save(function(err, result) {
                if (!err) {
                    res.json({ result: 'seller added' });
                } else
                    res.status(400).json(err);
            });
        } else {
            res.status(400).json(err);
        }
});

// edit user info
router.post('/edit', function(req, res, next) {
    if (req.userId) {
        var userObj = {}
        var validationResult = validator.isAlpha(req.body.name) &&
            validator.isEmail(req.body.email) &&
            (req.body.password ?
                validator.isLength(req.body.password, { min: 8 }) :
                true);

        if (validationResult) {
            userObj.name = req.body.name;
            userObj.email = req.body.email;
            if (req.body.password) {
                userObj.password = req.body.password;
            }
            if (req.body.image) {
                userObj.image = req.body.image;
            }
            User.update(
                { _id: req.userId },
                { $set: userObj },
                function(err, result) {
                    if (!err) {
                        res.json({ result: 'user edited' });
                    } else
                        res.status(400).json(err);
            });
        } else {
            res.status(400).json(err);
        }
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});

// edit seller info
router.post('/edit', function(req, res, next) {
    if (req.isSeller) {
        var sellerObj = {}
        var validationResult = validator.isAlpha(req.body.name) &&
            validator.isEmail(req.body.email) &&
            (req.body.password ?
                validator.isLength(req.body.password, { min: 8 }) :
                true) &&
            (req.body.nationalId ?
                validator.matches(req.body.nationalId, new RegExp(
                '(2|3)[0-9][1-9][0-1][1-9][0-3][1-9]' +
                '(01|02|03|04|11|12|13|14|15|16|17|18|19|21|' +
                '22|23|24|25|26|27|28|29|31|32|33|34|35|88)\\d\\d\\d\\d\\d')) :
                true);

        if (validationResult) {
            sellerObj.name = req.body.name;
            sellerObj.email = req.body.email;
            if (req.body.password) {
                sellerObj.password = req.body.password;
            }
            if (req.body.nationalId) {
                sellerObj.nationalId = req.body.nationalId;
            }
            if (req.body.image) {
                sellerObj.image = req.body.image;
            }
            Seller.update(
                { _id: req.userId },
                { $set: sellerObj },
                function(err, result) {
                    if (!err) {
                        res.json({ result: 'seller edited' });
                    } else
                        res.status(400).json(err);
            });
        } else {
            res.status(400).json(err);
        }
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});

// delete user
router.get('/delete', function(req, res, next) {
    if (req.userId) {
        User.remove({ _id: userId }, function (err, result) {
            if (!err) {
                res.json({ result: 'user deleted' });
            } else
                res.json(err);
        });
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});

//*********************************add To Cart***********************************//
// need to set amount along with product
router.put('/addtocart/:id', function(req, res, next) {
    console.log('userid', req.userId);
    if (req.userId) {
        Product.find({ _id: req.params.id }).count((err, count) => {
            if (!err && count) {
                User.update(
                    { _id: req.userId }, 
                    { $addToSet:
                        { cart: req.params.id }
                    }, function(err, result) {
                        if (!err) {
                            res.json({ result: 'product added' });
                        } else
                            res.json(err);
                });
            } else
                res.status(404).json(err ? err : { result: 'sorry, no such product' });
        });
    } else
        res.status(403).json({ result: 'user is not authenticated' });
}); 
//****************************Show Cart***************************************//
router.get('/showcart', function(req, res, next) {
    // console.log('cart id',req.userId);
    if (req.userId) {
        User.findOne({ _id: req.userId }).
        populate({ path: 'cart' }).
        exec(function(err, result) {
            if (!err) {
                console.log('user cart', result.cart);
                res.json({ result: result });  
            } else {
                res.status(400).json(err);
            }
        });
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});


//****************************Remove product from Cart*************************************//
// pullAll
router.post('/removefromcart/:id', function(req, res, next) {
    console.log('rrrrrrrrrrr',req.userId);
    console.log('pppppppp',req.params.id);
    if (req.userId) {
        console.log('rrrrrrrrrrr',req.userId);
        User.updateOne(
            { _id: req.userId }, 
            { $pullAll: { cart: [req.params.id] } },
            function(err, result) {
                if (!err) {
                    console.log('ressssssssssss',result);
                    res.json({ result: result });
                } else {
                    res.status(400).json(err); 
                }
        })
    } else
        res.status(403).json({ result: 'user is not authenticated' });
});
//********************************Clear Cart ***********************************************//
router.delete('/clearcart', function(req, res, next) {
    if (req.userId) {
        User.update(
            { _id: req.userId }, 
            { $pull: { cart: { $nin: [] } } },
            function (err, result) {
            if (!err) {
                res.json({ result: result });
            } else {
                res.status(400).json(err); 
            }
        })
    }else
        res.status(403).json({ result: 'user is not authenticated' });
});




module.exports = router;
