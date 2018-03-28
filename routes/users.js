var express = require('express');
var fs = require("fs");
var User = require('../models/user');
var Seller = require('../models/seller');

var router = express.Router();


// get user info
/*!!!!!!!!!!!!!!!!!!!!!!!!
 * req.userId expected
*/
router.get('/', function(req, res, next) {
    if (req.userId) {
    	User.find({ _id: req.userId }, function(err, result) {
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
/*!!!!!!!!!!!!!!!!!!!!!!!!
 * need to add validation of names, password, email, etc..
*/
router.post('/add', function(req, res, next) {
    var userObj = {}
    for (field of Object.keys(req.body)) {
        userObj[field] = req.body[field];
    }
    // if (req.file) {
    //     userObj.image = req.file.path;
    // }    
    var user = new User(userObj);
    user.save(function(err, result) {
        if (!err) {
            res.json({ result: 'user added' });
        } else
            res.json(err);
    });
});

// add seller info
router.post('/add_seller', function(req, res, next) {
    var sellerObj = {}
    for (field of Object.keys(req.body)) {
        sellerObj[field] = req.body[field];
    }
    // if (req.file) {
    //     sellerObj.image = req.file.path;
    // }    
    var seller = new Seller(sellerObj);
    seller.save(function(err, result) {
        if (!err) {
            console.log('aaaaaaaaaa');
            res.json({ result: 'seller added' });

        } else
            res.json(err);
    });
});

// edit user info
/*!!!!!!!!!!!!!!!!!!!!!
 * need to add validation of names, password, email, etc..
 * need to check for the match of access token and the sent id; to prevent any user
   from writing over other users info
*/
router.post('/edit', function(req, res, next) {
    if (req.userId) {
        var userObj = {}
        for (field of Object.keys(req.body)) {
            if (req.body[field] != '') {
                userObj[field] = req.body[field];
            }
        }
        // if (req.file) {
        //     var oldPicture = User.findOne({ _id: req.userId }, function(err, result) {
        //         if (!err) {
        //             if (result.image) {
        //                 fs.unlinkSync(result.image);
        //             }
        //             userObj.image = req.file.path;
        //         } else
        //             res.json(err);
        //     });
        // }
        User.update(
            { _id: req.userId },
            { $set: userObj },
            function(err, result) {
                if (!err) {
                    res.json({ result: 'user edited' });
                } else
                    res.json(err);
            });
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
router.put('/addtocart/:id', function(req, res, next) {
    if (req.userId) {
        User.update(
            {_id:req.userId}, 
            {$addToSet: {cart:req.params.id}},function (err, result) {
            if(!err){
                res.json(result);
            }else{
                 res.json(err); 
            }
        })
    }else
        res.status(403).json({ result: 'user is not authenticated' });
}); 
//****************************Show Cart***************************************//
router.get('/showcart/:id?',function(req, res, next) {
    User.find({_id:req.params.id}).populate({path:'cart'}).exec(function(err,result) {
        if(!err){
            res.json(result);  
        }else {
            res.json(err);
        }
    });
});


//****************************Remove product from Cart*************************************//
// pullAll
router.delete('/removefromcart/:id', function(req, res, next) {
    if (req.userId) {
        User.update(
            {_id:req.userId}, 
            {$pullAll: {cart:[req.params.id]}},function (err, result) {
            if(!err){
                res.json(result);
            }else{
                 res.json(err); 
            }
        })
    }else
        res.status(403).json({ result: 'user is not authenticated' });
});
//********************************Clear Cart ***********************************************//
router.delete('/clearcart', function(req, res, next) {
    if (req.userId) {
        User.update(
            {_id:req.userId}, 
            {$pull:{cart:{$nin:[]}}},function (err, result) {
            if(!err){
                res.json(result);
            }else{
                 res.json(err); 
            }
        })
    }else
        res.status(403).json({ result: 'user is not authenticated' });
});




module.exports = router;
