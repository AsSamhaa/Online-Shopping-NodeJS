var express=require('express');
var expressrouter = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var UserModel = mongoose.model("User");
var SellerModel = mongoose.model("Seller");
var nodemailer = require('nodemailer');

 
 
 
 
 //*****************************************Send Email******************************** */
 expressrouter.post('/forgetpassword',function(req,res){
    
    // var useremail=req.headers['email'];
    var useremail=req.body.email;
    var userpassword;
    if(typeof useremail !== "undefined" )
    {
        UserModel.findOne({email:useremail},function(err,userdata){
             
            if(userdata !== null)
            {
                        userpassword=userdata.password;
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
                            text: ' Your Password is'+userpassword
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            //   console.log('Email sent: ' + info.response);
                            res.json({'emailsent':'check your mail to remember your password'});  
                            }
                        });
                    
            }else
            {
                  res.json({'err':'not a user'});   
            }

        });

    }else
    {
        res.json({'err':'not a user'});  
    }
    
  });


  module.exports=expressrouter;