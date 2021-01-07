const config = require('../../common/config/env.config')
const User = require('../../users/models/users.model').User
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google_clientID,
        clientSecret: config.google_clientSecret,
        callbackURL: config.google_callbackURL
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          User.findOne({ 'google.id': profile.id }, function (err, user) {
            if (err) {
              return done(err)
            }
            if (user) {
              return done(null, user) // user found, return that user
            } else {
              // if there is no user found with that facebook id, create them
              const u = {
                google: {
                  id: profile.id,
                  displayName: profile.displayName
                },
                firstName: profile.name.givenName ? profile.name.givenName : '',
                lastName: profile.name.familyName ? profile.name.familyName : profile.displayName,
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
    )
  )
}