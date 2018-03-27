var express=require('express');
var expressrouter = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var UserModel = mongoose.model("User");
var SellerModel = mongoose.model("Seller");
// var nodemailer = require('nodemailer');





//************************Login************************ */
expressrouter.post('/',function(req,res){
   
//    var useremail=req.headers['email'];
//    var userpass=req.headers['password'];

    var useremail=req.body.email;
    var userpass=req.body.password;

    
    // var useremail='alaa@yahoo.com';
    // var userpass='123';

   console.log(useremail,userpass);  

if(typeof useremail !== "undefined" && typeof userpass !== "undefined")
 {
    console.log('testlogin');
    //check in users model
        UserModel.findOne({$and:[{"email":useremail},{"password":userpass}]},function(err,userdata){
          
            console.log(useremail,userpass,userdata);

            if(!err)
            {
                console.log('user',userdata);
               
                if(userdata!= null)
                {
                    var user_data={};
                    user_data.id=userdata._id;
                    user_data.name=userdata.name;
                    user_data.email=userdata.email;
                    user_data.password=userdata.password
                    user_data.image=userdata.image;
                    user_data.address=userdata.address;
                    user_data.isuser=true;

                    console.log('ud',user_data);

                    var user={};
                    user.email=userdata.email;
                    user.pass=userdata.password
                    user.isUser=true;

                    jwt.sign({user:user},'secretkey',function(err,token){

                        res.json({token:token,user:user_data});
                
                    });
                

                    
                }else
                {
                        //check in seller model
                        SellerModel.findOne({email:useremail},{password:userpass},function(err,userdata){
                            if(!err)
                            {
                                console.log('seller',userdata);
                                    if(userdata != null)
                                    {
                                            var user_data={};
                                            user_data.id=userdata._id;
                                            user_data.name=userdata.name;
                                            user_data.email=userdata.email;
                                            user_data.password=userdata.password
                                            user_data.image=userdata.image;
                                            user_data.address=userdata.address;
                                            user_data.isseller=true;
                                            
                                            var user={};
                                            user.email=userdata.email;
                                            user.pass=userdata.password
                                            user.isSeller=true;
                            
                                            jwt.sign({user:user},'secretkey',function(err,token){
                            
                                                res.json({token:token,user:user_data});
                                        
                                            });
                        
                                        
                                    }else
                                    {
                                        res.json({'err':'not a user'});  
                                    }

                            }else
                            {
                                res.json({'err':'not a user'});  
                            }

                        }); 



                }


            //else of user model err
            }else
            {
            console.log('not userrrrrrrrrr');
            res.json({'err':'not a user'});  
            
            }
        
        });

    }else
    {
        res.json({'err':'not a user'});
    }
  });
  






  //*****************************************Send Email******************************** */
  /*
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
    
  });*/

module.exports=expressrouter;