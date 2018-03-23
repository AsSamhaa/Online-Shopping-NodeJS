var express = require('express');

var router = express.Router();


/* to set the default for any request as not authenticated
and override any attempt to gain unauthorized access
*/
router.use(function(req, res, next) {
    req.isAuthenticated = false;
    next()
});

module.exports = router;
