var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
   
  if(req.user)
   res.json({'usrid':req.user.id});
   res.json({'not auth':"nooooooo"});

});

module.exports = router;
