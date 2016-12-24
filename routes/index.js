var express = require('express'), 
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Argument = mongoose.model('Argument');
    Topic = mongoose.model('Topic');

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/home');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

router.get('/registration', function(req, res) {
  res.render('register');
});

router.post('/registration', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/home');
      });
    }
  });   
});

function compare(a,b) {
  if (a.likes > b.likes)
    return -1;
  if (a.likes < b.likes)
    return 1;
  return 0;
}

router.get('/home', function(req, res) {
  Topic.find(function(err, topics) {
    topics.forEach(function(topic) {
      topic.affirmative.sort(compare);
      topic.negative.sort(compare);
      //console.log(topic.affirmative);
      //console.log(topic.negative);
    });
    res.render('index', {topic:topics.reverse()});
  })
});

router.get('/admin', function(req, res) {
  res.render('admin');
});

router.post('/admin', function(req, res) {
  new Topic({
    topic:req.body['topic'],
    definition:req.body['definition']
  }).save(function(err, topic) {
    //console.log(err, topic);
    res.redirect('/admin');
  });
});

router.get('/topics/:slug', function(req, res) {
  Topic.findOne({'slug':req.params.slug}, function(err, topic) {
    topic.affirmative.sort(compare);
    topic.negative.sort(compare);
    res.render('edit-topic.hbs', {topic:topic});  
  });
});

router.post('/topics/:slug', function(req, res) {
  if (req.body['affirmative-argument'] !== undefined) {
    var arg = new Argument({
      argument:req.body['affirmative-argument'],
      likes:0,
      user:req.body['username']
    });
    Topic.findOne({'slug':req.params.slug}, function(err, topic) {
      //console.log('topic: ', topic);
      topic.affirmative.push(arg);
      topic.save(function(err, topic) {
        //console.log(err, topic);
      });
  });
  } else {
    var arg = new Argument({
      argument:req.body['negative-argument'],
      likes:0,
      user:req.body['username']
    });
    Topic.findOne({'slug':req.params.slug}, function(err, topic) {
      //console.log('topic: ', topic);
      topic.negative.push(arg);
      topic.save(function(err, topic) {
        //console.log(err, topic);
      });
  });
  }
  var url = '/topics/' + req.params.slug;
  res.redirect(url);
});

router.post('/like/post', function(req, res) {
  Topic.findOne({'topic':req.body['topic']}, function(err, topic){
    var id = req.body.id;
    var argType = req.body.type;
    var comment;
    //console.log('this is the argtype: ', argType);
    if (argType === 'affirmative') {    
      comment = topic.affirmative.id(id);
    } else {
      comment = topic.negative.id(id);
    }
    comment.likes = req.body.likes;
    topic.save(function(err, topic) {
      //console.log(topic);
    });
  });  
});

// router.get('/api/comments', function(req, res) {
//   Topic.find({'title':req.query.title}, function(err, topics) {
//     if (req.query.type === "affirmative") {
//       res.json(topics.affirmative.map(function(ele) {
//         return {
//           "argument":ele.argument,
//           "likes":ele.likes,
//           "user":ele.user,
//           "time":ele.time
//         }
//       }));
//     } else {
//       res.json(topics.negative.map(function(ele) {
//         return {
//           "argument":ele.argument,
//           "likes":ele.likes,
//           "user":ele.user,
//           "time":ele.time
//         }
//       }));
//     }
//   });
// });

// router.post('/api/comments/create', function(req, res) {
//   if (req.body['affirmative-argument'] !== undefined) {
//     var arg = new Argument({
//       argument:req.body.argument,
//       likes:0,
//       user:req.body.username
//     });
//     Topic.findOne({'topic':req.body.topic}, function(err, topic) {
//       console.log('topic: ', topic);
//       topic.affirmative.push(arg);
//       topic.save(function(err, topic) {
//         console.log(err, topic);
//       });
//   });
//   } else {
//     var arg = new Argument({
//       argument:req.body.argument,
//       likes:0,
//       user:req.body.username
//     });
//     Topic.findOne({'topic':req.body.topic}, function(err, topic) {
//       console.log('topic: ', topic);
//       topic.negative.push(arg);
//       topic.save(function(err, topic) {
//         console.log(err, topic);
//       });
//   });
//   }
// });

module.exports = router;
