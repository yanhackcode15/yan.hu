var express = require('express');
var router = express.Router();
var NewResume = require('../models/resume');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express', name: 'Yan Hu' });
// });
router.get('/', function(req, res, next) {
	NewResume.find().exec(function(err, doc){
			if (err) {console.log("err")}
			res.render('indexPage', {items: doc})
	});
});

router.get('/resume', function(req, res, next) {
	NewResume.find().exec(function(err, doc){
			if (err) {console.log("err")}
			res.render('resumePage', {items: doc})
	});
});

router.get('/about', function(req, res, next) {
	NewResume.find().exec(function(err, doc){
			if (err) {console.log("err")}
			res.render('aboutPage', {items: doc})
	});
});

module.exports = router;
