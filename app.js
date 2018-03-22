var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var socialmedia = require('./routes/socialmedia');
var auth = require('./routes/auth');
var jwt = require('jsonwebtoken');

var fs = require("fs");
//connect with database using mongoose
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/souq");


fs.readdirSync(path.join(__dirname,"models")).forEach(function(filename){
    require('./models/'+filename);
});


var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//**********************************restful api**********************************************************/
app.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Content-Type,Authorization");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
  next();
});
//**************************************************authentication middle ware************************************************** */

app.use(function(req,res,next){
  //get auth header value
  const bearerheader=req.headers['authorization'];
  // console.log(bearerheader);
  if(typeof bearerheader !== "undefined"){
    const bearertoken=bearerheader;
    //set token
    req.token=bearertoken;
    req.user={};
    console.log('dddd');

    jwt.verify(req.token,'secretkey',function(err,authdata){
      if(err)
      {
          res.send(err);
      }else{
          //check user data
          //select this user from db and check if authdata
          req.user.id=authdata.user.id;
          // req.redirect('/users');
          // res.json(req.user);
          //authdata.user.id
          next();
        }
      
  });
   
    
}else{
  console.log('header not exist');
  res.send('else');

}

// res.send('yarab');
});


app.use('/', index);
app.use('/auth',auth);
app.use('/users', users);
app.use('/socialmedia',socialmedia);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
