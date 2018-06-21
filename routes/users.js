var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource and more');
});

router.get('/cool', function(req, res, next) {
	res.send('cool next route is here');
});

module.exports = router;
