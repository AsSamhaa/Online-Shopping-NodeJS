/* put authentication logic here */
var express = require('express');

var router = express.Router();


router.use(function(req, res, next) {
    /*!!!!!!!!!!!!!!!!!!!!!!
     * need to get the middleware to parse the access token and assign a userId..
     * to the body instead of req.isAuthenticated
    */
    req.userId = '5ab701a0eaf5213e189f6bb7';
    next()
});

module.exports = router;
