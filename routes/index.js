var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
	res.send('index');
});

router.get('/fburl',function(req,res){

});

module.exports = router;