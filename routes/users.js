var express = require('express');
var User = require('../models/user');
var router = express.Router();

/************************************ get user info ****************************************/
router.get('/:id?', function(req, res, next) {
	User.find({_id:req.params.id}, function (err, result) {
        if(!err){
            console.log(result);
            res.json({result:result});
        }else{
            res.json(err);    
        }	
	})
});
/******************************** add user info *******************************************/
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
/***************************** edit user info **************************/
router.post('/edit/:id', function(req, res, next) {
	User.update({_id:req.params.id}, 
		{$set:{name:req.body.name,email:req.body.email,password:req.body.password}}, 
		function (err, result) {
            if(!err){
                // res.send(req.body)
                res.json({result:'edit Done'});
            }else{
                 res.json(err); 
        }
    })
});

/******** delete user ....Working but no need for it  **********/
router.get('/delete/:id?', function(req, res, next) {
	User.remove({_id:req.params.id}, function (err, result) {
		resp.json({status:"ok"});
	})
});


module.exports = router;