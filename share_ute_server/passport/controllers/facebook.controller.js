const config = require('../../common/config/env.config')
const User = require('../../users/models/users.model').User 
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = function (passport) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook_clientID,
    clientSecret: config.facebook_clientSecret,
    callbackURL: config.facebook_callbackURL
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'fb.id': profile.id }, function (err, user) {
          if (err) {
            return done(err)
          }
          if (user) {
            return done(null, user) // user found, return that user
          } else {
            const u = {
              fb: {
                id: profile.id,
                displayName: profile.displayName
              },
              firstName: profile.name.givenName ? profile.name.givenName : '',
              lastName: profile.name.familyName ? profile.name.familyName : profile.displayName,
              email: '',
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