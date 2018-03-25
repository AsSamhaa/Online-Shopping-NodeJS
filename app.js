var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");
var jwt = require('jsonwebtoken');
var auth = require('./routes/auth');
var socialmedia = require('./routes/socialmedia');
var products = require('./routes/products');
var users = require('./routes/users');
var categories = require('./routes/categories');
var login = require('./routes/login');



//connect with database using mongoose
mongoose.connect("mongodb://localhost:27017/souq");

//not Working !!
fs.readdirSync(path.join(__dirname,"models")).forEach(function(filename){
    require('./models/'+filename);
});

var upload = multer({ dest: 'public/images/' });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.single('image'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);
app.use('/login', login) ;
app.use('/socialmedia', socialmedia);
app.use('/products', products);
app.use('/users', users);
app.use('/categories', categories);




// //**********************************restful api**********************************************************/
// app.use(function(req,resp,next){
//   resp.header("Access-Control-Allow-Origin","*");
//   resp.header("Access-Control-Allow-Headers","Content-Type,Authorization,email,password,X-ACCESS_TOKEN , Access-Control-Allow-Origin ,  Origin , x-requested-with ");
//   resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE"),
  
//   next();
// });


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
  res.render('error');
});

module.exports = app;
