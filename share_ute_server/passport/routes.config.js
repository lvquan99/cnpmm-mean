const User = require('../users/models/users.model').User

const FacebookController = require('./controllers/facebook.controller')
const GoogleController = require('./controllers/google.controller')
const GithubController = require('./controllers/github.controller')
const LinkedinController = require('./controllers/linkedin.controller')
const AmazonController = require('./controllers/amazon.controller')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  FacebookController(passport)
  GoogleController(passport)
  GithubController(passport)
  LinkedinController(passport)
  AmazonController(passport)
}