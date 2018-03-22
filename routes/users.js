var express = require('express');
var router = express.Router();
// start editing 
var bodyParser = require("body-parser")
var JSONParser = bodyParser.json();
var urlEncodedParsermid = bodyParser.urlencoded();
var mongoose = require("mongoose");
var UserModel = mongoose.model("User");
var multer = require("multer");
var fileUploadMid = multer({dest:"./public/images/users"});

router.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
  next();
});

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('respond with a resource');
  	UserModel.find({}, function (err, result) {
		res.json(result);
	});
});

//****************add user******************//


// for testing
// router.post("/",function (req, resp) {
// 	var user = new UserModel({
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



router.post("/", fileUploadMid.single("img"),function (req, resp) {
	console.log(req.body, req.file.filename);
	var user = new UserModel({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		image: req.file.filename
	});
	user.save(function (err, doc) {
	    if(!err)
	      resp.json({status:"ok"});
	    else
	      resp.json(err);
	})
})

router.get("/:id", function (req, resp) {
	UserModel.find({_id:req.params.id}, function (err, result) {
		console.log(result)
		resp.json(result);
	})
})


router.put("/:id", JSONParser,function (req, resp) {
	UserModel.update({_id:req.params.id}, 
		{$set:{name:req.body.name,email:req.body.email,password:req.body.password}}, 
		function (err, result) {
		resp.json({redirect:"/users/"+req.params.id});
	})
})

router.delete("/:id",function (req, resp) {
	UserModel.remove({_id:req.params.id}, function (err, result) {
		resp.json({status:"ok"});
	})
})

module.exports = router;