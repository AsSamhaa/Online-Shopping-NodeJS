var express = require('express');
var expressrouter = express.Router();


//**************************authentication middle ware************************************************** */
expressrouter.use(function(req,res,next){
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

module.exports = router;
