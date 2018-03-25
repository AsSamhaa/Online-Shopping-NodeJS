var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");


//connect with database using mongoose
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/souq");

// require('./models/user');
// require('./models/seller');
// require('./models/subcategory');
// require('./models/product');
// require('./models/order');

fs.readdirSync(path.join(__dirname,"models")).forEach(function(filename){
    require('./models/'+filename);
});


var index = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');
var categories = require('./routes/categories');
var socialmedia = require('./routes/socialmedia');
var auth = require('./routes/auth');
var login = require('./routes/login');
var jwt = require('jsonwebtoken');
var fs = require("fs");


var UserModel = mongoose.model("User");
var SellerModel = mongoose.model("Seller");



//not Working !!
// fs.readdirSync(path.join(__dirname,"models")).forEach(function(filename){
//     require('./models/'+filename);
// });



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
  resp.header("Access-Control-Allow-Headers","Content-Type,Authorization,email,password,X-ACCESS_TOKEN , Access-Control-Allow-Origin ,  Origin , x-requested-with ");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE"),
  
  next();
});



app.use(auth);
app.use('/', index);
app.use('/login',login) ;
app.use('/products', products);
app.use('/users', users);
app.use('/socialmedia',socialmedia);
app.use('/categories',categories);


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

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send(res.locals);
});

module.exports = app;
