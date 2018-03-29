var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var UserModel = require('../models/user');
var SellerModel = require('../models/seller');


//**************************authentication middle ware************************************************** */
router.use(function(req,res,next){
    //get auth header value

    // const bearerheader=req.headers['authorization'];
    const bearerheader=req.body.usertoken;
     console.log(req.body);       
    // console.log(bearerheader);

  if(typeof bearerheader !== "undefined"){

          const bearertoken=bearerheader;
          //set token
          req.token=bearertoken;
          // req.user={};
          req.userId='';
          req.isSeller=false;
          req.isUser=false;
          console.log('before verify token');

      jwt.verify(req.token,'secretkey',function(err,authdata){
          if(err)
          {
              res.send(err);

          }else{
            console.log('token data',authdata);

              //check user data
              //select this user from db and check if authdata
              console.log('after verify token');

                  if(authdata.user.isSeller)
                  {
                    console.log('check in seller module ');
                      //check in seller module 
                      SellerModel.findOne({$and:[{"email":authdata.user.email},{"password":authdata.user.pass}]},function(err,userdata){
                          
                        console.log('auth seller',userdata);
                         if(userdata != null)
                         {
                          console.log('iiiiiiiiiid',userdata._id);
                            // req.user.isSeller=true;
                            // req.user.isAuthenticated=true;
                            // req.user.id=userdata._id;
                            req.userId=userdata._id;
                            req.isSeller=true;
                            next();
                         }
                          
                      });
                        

                  }else if(authdata.user.isUser)
                  {
                    console.log('check in user module ');
                   
                        //check in users model
                        UserModel.findOne({$and:[{"email":authdata.user.email},{"password":authdata.user.pass}]},function(err,userdata){
                          console.log('uuuuuuuuuuiiiiiiiiiid',userdata._id);
                          if(userdata != null)
                          {
                            // req.user.isUser=true;
                            // req.user.isAuthenticated=true;
                            // req.user.id=userdata._id;
                            req.userId=userdata._id;
                            req.isUser=true;
                            next();
                          }
                         
                        });
                                     
                  }else if(authdata.user.socialuser)
                    {
                      console.log('check in Social module ');
                          //check in users model
                          UserModel.findOne(
                            { $and: [
                              {"email":authdata.user.email},
                              {"socialId":authdata.user.id}
                            ]},
                            function(err,userdata){
                            console.log('ssssssssuuuuuuuuuuiiiiiiiiiid',userdata);
                            
                            if(userdata != null)
                            {
                              // req.user.socialuser=true;
                              // req.user.isAuthenticated=true;
                              // req.user.id=userdata._id;
                              // console.log(' Social Auth ');
                              //  console.log(req.user);
                              req.userId=userdata._id;
                              console.log('rrrrrrrrrrr',req.userId);
                              req.socialuser=true;
                               next();
                            }
                            
                          });
                   }
            }

          // next();     
    });

      // next();
      
}else{
  console.log('header not exist');
   next();
}
});

module.exports = router;
