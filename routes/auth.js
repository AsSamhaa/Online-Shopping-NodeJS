var express=require('express');
var expressrouter = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var UserModel = mongoose.model("User");
var SellerModel = mongoose.model("Seller");

//**********************************restful api**********************************************************/
// expressrouter.use(function(req,resp,next){
//     resp.header("Access-Control-Allow-Origin","*");
//     resp.header("Access-Control-Allow-Headers","Content-Type,Authorization,email,pass");
//     resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
//     next();
//   });
  
//********************************************************************************************************* */

expressrouter.post('/login',function(req,res){
   
   var useremail=req.headers['email'];
   var userpass=req.headers['password'];

   console.log(email,pass);  
   //check in users model
    UserModel.findOne({$and:[{email:useremail},{password:userpass}]},function(err,userdata){
        if(!err)
        {
            if(userdata._id)
            {
                var user_data={};
                user_data.id=userdata._id;
                user_data.name=userdata.name;
                user_data.email=userdata.email;
                user_data.password=userdata.password
                user_data.image=userdata.image;
                user_data.address=userdata.address;


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
                    SellerModel.findOne({$and:[{email:useremail},{password:userpass}]},function(err,userdata){
                        if(!err)
                        {
                                if(userdata._id)
                                {
                                        var user_data={};
                                        user_data.id=userdata._id;
                                        user_data.name=userdata.name;
                                        user_data.email=userdata.email;
                                        user_data.password=userdata.password
                                        user_data.image=userdata.image;
                                        user_data.address=userdata.address;
                                        
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

         res.json({'err':'not a user'});  
        
        }
      
      });

  
  });
  

// expressrouter.post('/register',function(req,res){

//     user={
//         id:122,
//         name:'gogo'
//     }

//     jwt.sign({user:user},'secretkey',function(err,token){
       
//         res.json({token:token});

//     });

//   });




// function verifyToken(req,res,next){
//     //get auth header value
//     const bearerheader=req.headers['authorization'];
//     if(typeof(bearerheader !== undefined)){
//         const bearertoken=bearerheader;
//         //set token
//         req.token=bearertoken;
//         req.user={};
//         next();
//     }else{
//         res.json({'error':'unauthorized'});
//     }

// }


// expressrouter.post('/login',verifyToken,function(req,res){
//   jwt.verify(req.token,'secretkey',function(err,authdata){
//       if(err)
//       {
//           res.send(err);
//       }else{
//           //check user data
//           //select this user from db and check if authdata
//           req.user={'id':authdata.user.id};
//           res.json(req.user);
//           //authdata.user.id
//       }
//   })
//     res.json();

// });

  




module.exports=expressrouter;