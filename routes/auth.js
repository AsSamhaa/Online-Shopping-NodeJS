var express = require('express');
var router = express.Router();


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
          req.user={};
          console.log('before verify token');

      jwt.verify(req.token,'secretkey',function(err,authdata){
          if(err)
          {
              res.send(err);

          }else{

              //check user data
              //select this user from db and check if authdata
              console.log('after verify token');

                  if(authdata.user.seller)
                  {
                    console.log('check in seller module ');
                      //check in seller module 
                      SellerModel.findOne({email:authdata.user.email},{password:authdata.user.pass},function(err,userdata){
                          
                         if(userdata != null)
                         {
                            req.user.isSeller=true;
                            req.user.isAuthenticated=true;
                            req.user.id=userdata._id;
                            next();
                         }
                          
                      });
                        

                  }else if(authdata.user.isuser)
                  {
                    console.log('check in user module ');
                        //check in users model
                        UserModel.findOne({email:authdata.user.email},{password:authdata.user.pass},function(err,userdata){
                         
                          if(userdata != null)
                          {
                            req.user.isUser=true;
                            req.user.isAuthenticated=true;
                            req.user.id=userdata._id;
                            next();
                          }
                         
                        });
                                     
                  }else if(authdata.user.socialuser)
                    {
                      console.log('check in Social module ');
                          //check in users model
                          UserModel.findOne({email:authdata.user.email},{socialId:authdata.user.id},function(err,userdata){
                            
                            if(userdata != null)
                            {
                              req.user.socialuser=true;
                              req.user.isAuthenticated=true;
                              req.user.id=userdata._id;
                              console.log(' Social Auth ');
                               console.log(req.user);
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
