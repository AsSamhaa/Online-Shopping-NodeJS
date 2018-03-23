var express = require('express');
var User = require('../models/user');

var router = express.Router();

// start editing 
// var mongoose = require("mongoose");
// var User = mongoose.model("User");
// var multer = require("multer");
// var fileUploadMid = multer({dest:"./public/images/users"});

// router.use(function(req,resp,next){
//   resp.header("Access-Control-Allow-Origin","*");
//   resp.header("Access-Control-Allow-Headers","Content-Type");
//   resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
//   next();
// });


/* get user info */
router.get('/:id?', function(req, res, next) {
	User.find({_id:req.params.id}, function (err, result) {
		console.log(result)
		resp.json(result);
	})
});

/* add user info */
router.post('/add', function(req, res, next) {
    // if (req.isAuthenticated) {
    //     // statement
    // }
    console.log(req.body.name);
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        image: req.body.image,

    })
    user.save(function(err, result){
        if(!err){
            // res.send(req.body)
            res.json({result:'user added'});
        }else{
            res.json(err);
            
        }
    })
})
/* edit user info */
router.post('/edit', function(req, res, next) {
	User.update({_id:req.params.id}, 
		{$set:{name:req.body.name,email:req.body.email,password:req.body.password}}, 
		function (err, result) {
		resp.json({redirect:"/users/"+req.params.id});
	})
});

/* delete user */
router.get('/delete/:id?', function(req, res, next) {
	User.remove({_id:req.params.id}, function (err, result) {
		resp.json({status:"ok"});
	})
});


module.exports = router;

//****************add user******************//


// for testing
// router.post("/",function (req, resp) {
// 	var user = new User({
// 		name:"ahmed",
// 		email:"a@yahoo.com",
// 		password:"as1244",
// 	});
// 	user.save(function (err, doc) {
// 	    if(!err)
// 	      resp.json({status:"ok"});
// 	    else
// 	      resp.json(err);
// 	})
// })



// router.post("/", fileUploadMid.single("img"),function (req, resp) {
// 	console.log(req.body, req.file.filename);
// 	var user = new User({
// 		name: req.body.name,
// 		email: req.body.email,
// 		password: req.body.password,
// 		image: req.file.filename
// 	});
// 	user.save(function (err, doc) {
// 	    if(!err)
// 	      resp.json({status:"ok"});
// 	    else
// 	      resp.json(err);
// 	})
// })
