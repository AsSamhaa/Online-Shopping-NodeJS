var express=require('express');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../models/user');
var Seller = require('../models/seller');

var router = express.Router();
// var nodemailer = require('nodemailer');
//************************Login************************ */
router.post('/',function(req,res) {
    var useremail = req.body.email;
    var userpass = req.body.password;
    if (useremail && userpass) {
        //check in users model
        User.findOne(
        { $and: [{ email: useremail }, { password: userpass }] },
        function(err, userdata) {
            if (!err && userdata) {
                var userData = userdata;
                userData.id = userData._id;
                delete userData['_id']; // not sure why?!!
                userData.isuser = true;

                var user = {}
                user.email = userdata.email;
                user.pass = userdata.password
                user.isUser = true;

                jwt.sign(
                    { user: user },
                    'secretkey',
                    function(err, token) {
                        res.json({ token: token, user: userData });
                });
            } else {
                //check in seller model
                Seller.findOne(
                    { $and: [{ email: useremail }, { password: userpass }] },
                    function(err, sellerdata) {
                        if (!err && sellerdata) {
                            var sellerData = sellerdata;
                            sellerData.id = sellerData._id;
                            delete sellerData['_id']; // not sure why?!!
                            sellerData.isSeller = true;
                            
                            var seller = {};
                            seller.email = userdata.email;
                            seller.pass = userdata.password;
                            seller.isSeller = true;

                            jwt.sign(
                                { user: seller },
                                'secretkey',
                                function(err, token) {
                                    res.json({ token: token, user: sellerData });
                            });
                        } else {
                            res.staus(403).json({ error: 'not a user' });  
                        }
                });
            }
        });
    } else {
        res.status(400).json({ error: 'enter valid credentials' });
    }
});

module.exports = router;
