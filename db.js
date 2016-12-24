var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({ });
// User.register (creating a new user)
// User.authenticate (strategy)

var ArgumentSchema = new mongoose.Schema({
  argument:String,
  likes:Number,
  user:String,
  time: {type:Date, default:Date.now()}
});

var TopicSchema = new mongoose.Schema({
  topic:String,
  definition:String,
  affirmative:[ArgumentSchema],
  negative:[ArgumentSchema],
  time: {type:Date, default:Date.now}
});

// NOTE: we're using passport-local-mongoose as a plugin
// our schema for user looks pretty thin... but that's because
// the plugin inserts salt, password and username
UserSchema.plugin(passportLocalMongoose);

TopicSchema.plugin(URLSlugs('topic'));

mongoose.model('User', UserSchema);
mongoose.model('Argument', ArgumentSchema);
mongoose.model('Topic', TopicSchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/great-debate';
}

mongoose.connect(dbconf);
