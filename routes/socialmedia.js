var express = require('express');
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var User = require("../models/user");

var expressserver = express.Router();


expressserver.post('/login',function(req,res){

    console.log('social login');

    var useremail=req.body.email;
    var userid=req.body.id;
    var userimage=req.body.image;
    var usertoken=req.body.token;
    var username=req.body.name;

    console.log(req.body);
    
    var user={
      id:userid,
      name:username,
      email:useremail,
      image:userimage,
      token:usertoken,
      socialuser:true
    
    };

    console.log('uuuuuuuuuuuuuuuuuuuuuuu',user);
    
    User.findOne({$and:[{"email":useremail},{"socialId":userid}]},function(err,userdata){
                    
        console.log('testlogin');
        if(userdata !== null)
        {
            console.log('updateuserddddddddddddddddddddd');   
                    //update user access token
                User.update({email:user.email},{socialId:userid},{"$set":{name:username,image:userimage,accessToken:usertoken}},function(err,data){
                    if(!err)
                    {
                        jwt.sign({user:user},'secretkey',function(err,token){
                                            
                            res.json({token:token,user:user});
                           
                        });

                    }else
                    {
                        res.json({'err':'not a user'});

                    }
                    
                });

            
        }else
        {
           //add user
           console.log('savvvvvvvvvvvvvvv');  
            var adduser=new User({
                name:username,
                email:useremail,
                image:userimage,
                socialId:userid,
                accessToken:usertoken,
              });

            adduser.save(function(err,doc){
                        if(!err)
                        {
                            //send user token
                                jwt.sign({user:user},'secretkey',function(err,token){
                                    console.log('addddd');   
                                    res.json({token:token,user:user});
                                  
                                });

                        }else{
                            res.json({'err':'not a user'});
                        }
                
                   });
                   
        }

    });


});



expressserver.post('/test',function(req,res){

    console.log('tttttttt',req.user,req.user.isAuthenticated);
    // res.json({'user':'auth'});
    
    if(req.user.isAuthenticated)
    {
        console.log('user is aurh');
        res.json({'user':'auth'});
    }
    else
    {

    console.log('afffffff',req.user.isAuthenticated);
        res.json({'user':'notauth'});
    }



});


module.exports=expressserver;
