var express = require('express');
var router = express.Router();

require('../db.js');
var mongoose = require('mongoose');
//var User = mongoose.model('User');
//var Post = mongoose.model('Post');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
	res.render('login');
});

router.get('/signup', function(req, res, next) {
	res.render('signup');
});

router.post('/signup', function(req, res, next) {
	console.log('signing up');
});

module.exports = router;
