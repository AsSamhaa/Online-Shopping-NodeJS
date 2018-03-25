/* put authentication logic here */
var express = require('express');

var router = express.Router();


module.exports = router;
var express = require('express');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var nodemailer = require('nodemailer');
var User = require("../models/user");
var Seller = require("../models/seller");

var router = express.Router();

// login
router.post('/login', function(req, res) {
    var useremail = req.headers['email'];
    var userpass = req.headers['password'];
    console.log(useremail, userpass);
    if (typeof useremail !== "undefined" && typeof userpass !== "undefined") {
        console.log('testlogin');
        //check in users model
        User.findOne(
        { $and: [{ email: useremail }, { password: userpass }] },
        function(err, userdata) {
            if (!err) {
                console.log('user', userdata);
                if (userdata !== null) {
                    var user_data = {};
                    user_data.id = userdata._id;
                    user_data.name = userdata.name;
                    user_data.email = userdata.email;
                    user_data.password = userdata.password
                    user_data.image = userdata.image;
                    user_data.address = userdata.address;

                    var user = {};
                    user.email = userdata.email;
                    user.pass = userdata.password
                    user.isUser = true;

                    jwt.sign({
                        user: user
                    }, 'secretkey', function(err, token) {

                        res.json({
                            token: token,
                            user: user_data
                        });

                    });



                } else {
                    //check in seller model
                    SellerModel.findOne({
                        $and: [{
                            email: useremail
                        }, {
                            password: userpass
                        }]
                    }, function(err, userdata) {
                        if (!err) {
                            console.log('seller', userdata);
                            if (userdata !== null) {
                                var user_data = {};
                                user_data.id = userdata._id;
                                user_data.name = userdata.name;
                                user_data.email = userdata.email;
                                user_data.password = userdata.password
                                user_data.image = userdata.image;
                                user_data.address = userdata.address;

                                var user = {};
                                user.email = userdata.email;
                                user.pass = userdata.password
                                user.isSeller = true;

                                jwt.sign({
                                    user: user
                                }, 'secretkey', function(err, token) {

                                    res.json({
                                        token: token,
                                        user: user_data
                                    });

                                });


                            } else {
                                res.json({
                                    'err': 'not a user'
                                });
                            }

                        } else {
                            res.json({
                                'err': 'not a user'
                            });
                        }

                    });



                }



                //else of user model err
            } else {

                res.json({
                    'err': 'not a user'
                });

            }

        });

    } else {
        res.json({
            'err': 'not a user'
        });
    }
});








//*****************************************Send Email******************************** */
router.post('/forgetpassword', function(req, res) {

    var useremail = req.headers['email'];
    var userpassword;
    if (typeof useremail !== "undefined") {
        User.findOne({
            email: useremail
        }, function(err, userdata) {

            if (userdata !== null) {
                userpassword = userdata.password;
                //send mail to verify password
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'souqneyiti@gmail.com',
                        pass: 'souq1234'
                    }
                });

                var mailOptions = {
                    from: 'souqneyiti@gmail.com',
                    to: useremail,
                    subject: 'Sending Email using Souqney ITI project',
                    text: ' Your Password is' + userpassword
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        //   console.log('Email sent: ' + info.response);
                        res.json({
                            'emailsent': 'check your mail to remember your password'
                        });
                    }
                });

            } else {
                res.json({
                    'err': 'not a user'
                });
            }

        });

    } else {
        res.json({
            'err': 'not a user'
        });
    }

});

module.exports = router; >>>
