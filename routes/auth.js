var express=require('express');
var expressrouter = express.Router();
var jwt = require('jsonwebtoken');


//**********************************restful api**********************************************************/
// expressrouter.use(function(req,resp,next){
//     resp.header("Access-Control-Allow-Origin","*");
//     resp.header("Access-Control-Allow-Headers","Content-Type,Authorization");
//     resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
//     next();
//   });
  
//********************************************************************************************************* */



expressrouter.post('/register',function(req,res){

    user={
        id:122,
        name:'gogo'
    }

    jwt.sign({user:user},'secretkey',function(err,token){
       
        res.json({token:token});

    });

  });




function verifyToken(req,res,next){
    //get auth header value
    const bearerheader=req.headers['authorization'];
    if(typeof(bearerheader !== undefined)){
        const bearertoken=bearerheader;
        //set token
        req.token=bearertoken;
        req.user={};
        next();
    }else{
        res.json({'error':'unauthorized'});
    }

}


expressrouter.post('/login',verifyToken,function(req,res){
  jwt.verify(req.token,'secretkey',function(err,authdata){
      if(err)
      {
          res.send(err);
      }else{
          //check user data
          //select this user from db and check if authdata
          req.user={'id':authdata.user.id};
          res.json(req.user);
          //authdata.user.id
      }
  })
    res.json();

});

  




module.exports=expressrouter;