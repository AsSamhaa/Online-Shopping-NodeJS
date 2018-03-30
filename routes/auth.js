var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Seller = require('../models/seller');

var router = express.Router();

//**************************authentication middle ware************************************************** */
router.use(function(req, res, next) {
    // get auth header value
    // const bearerHeader=req.headers['authorization'];
    const bearerHeader = req.body.usertoken;
    if (bearerHeader) {
        // set token
        req.token = bearerHeader;
        req.userId = '';
        req.isSeller = false;
        req.isUser = false;

        jwt.verify(req.token, 'secretkey', function(err, authdata) {
            if (!err) {
                // check user data
                // select this user from db and check if authdata
                if (authdata.user.isSeller) {
                    // check in seller model
                    Seller.findOne(
                        { $and: [
                            { email: authdata.user.email },
                            { password: authdata.user.pass }
                        ]},
                        function(err, userData){
                        if (userData) {
                            console.log(userData);
                            req.userId = userData._id;
                            req.isSeller = true;
                            next();
                        }
                    });
                } else if (authdata.user.isUser) {
                        // check in users model
                        User.findOne(
                            { $and: [
                                { 'email': authdata.user.email },
                                {'password': authdata.user.pass }
                            ] },
                            function(err, userData) {
                                if (userData) {
                                    req.userId=userData._id;
                                    req.isUser=true;
                                    next();
                                }
                            });
                } else if (authdata.user.socialuser) {
                    // check in users model
                    User.findOne(
                    { $and: [
                        { 'email': authdata.user.email },
                        { 'socialId': authdata.user.id }
                    ] },
                    function(err, userData) {
                        if (userData) {
                            req.userId = userData._id;
                            req.socialUser=true;
                            next();
                        }
                    });
                }
            } else
                res.json({ error: err.message });
        });
    } else {
        next();
    }
});

module.exports = router;



// var express = require('express');
// var jwt = require('jsonwebtoken');
// var User = require('../models/user');
// var Seller = require('../models/seller');

// var router = express.Router();

// //**************************authentication middle ware************************************************** */
// router.use(function(req, res, next) {
//     // get auth header value
//     // const bearerHeader=req.headers['authorization'];
//     const bearerHeader = req.body.usertoken;
//     if (bearerHeader) {
//         // set token
//         req.token = bearerHeader;
//         req.userId = '';
//         req.isSeller = false;
//         req.isUser = false;

//         jwt.verify(req.token, 'secretkey', function(err, authdata) {
//             if (!err) {
//                 // check user data
//                 // select this user from db and check if authdata
//                 if (authdata.user.isSeller) {
//                     // check in seller model
//                     Seller.findOne(
//                         { $and: [
//                             { email: authdata.user.email },
//                             { password: authdata.user.pass }
//                         ]},
//                         function(err, userData){
//                         if (userData) {
//                             console.log(userData);
//                             req.userId = userData._id;
//                             req.isSeller = true;
//                             next();
//                         }
//                     });
//                 } else if (authdata.user.isUser) {
//                         // check in users model
//                         User.findOne(
//                             { $and: [
//                                 { 'email': authdata.user.email },
//                                 {'password': authdata.user.pass }
//                             ] },
//                             function(err, userData) {
//                                 if (userData) {
//                                     req.userId=userData._id;
//                                     req.isUser=true;
//                                     next();
//                                 }
//                             });
//                 } else if (authdata.user.socialuser) {
//                     // check in users model
//                     User.findOne(
//                     { $and: [
//                         { 'email': authdata.user.email },
//                         { 'socialId': authdata.user.id }
//                     ] },
//                     function(err, userData) {
//                         if (userData) {
//                             req.userId = userData._id;
//                             req.socialUser=true;
//                             next();
//                         }
//                     });
//                 }
//             } else
//                 res.json({ error: err.message });
//         });
//     } else {
//         next();
//     }
// });

// module.exports = router;
