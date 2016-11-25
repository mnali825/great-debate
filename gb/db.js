var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');

var User = new mongoose.Schema({
	username:String,
	password:String
});

var Post = new mongoose.Schema({
	user: User,
	comment:String,
	//time:
});