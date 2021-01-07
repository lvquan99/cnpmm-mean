const config = require('../../common/config/env.config')
const User = require('../../users/models/users.model').User 
const AmazonStrategy = require('passport-amazon').Strategy

module.exports = function (passport) {
  passport.use(new AmazonStrategy({
    clientID: config.amazon_clientID,
    clientSecret: config.amazon_clientSecret,
    callbackURL: config.amazon_callbackURL

  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'amazon.id': profile.id }, function (err, user) {
          if (err) {
            return done(err)
          }
          if (user) {
            return done(null, user) // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            const u = {
              amazon: {
                id: profile.id,
                displayName: profile.displayName ? profile.displayName : '',
              },
              firstName: '',
              lastName: profile.displayName,
              email: profile.emails[0].value,
              permissionLevel: 1,
            }
            var newUser = new User(u)
            newUser.save(function (err) {
              if (err)
                throw err
              return done(null, newUser)
            })
          }
        })
      })
    }
  ))
}