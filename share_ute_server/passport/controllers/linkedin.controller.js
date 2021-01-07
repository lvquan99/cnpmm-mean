const config = require('../../common/config/env.config')
const User = require('../../users/models/users.model').User
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

module.exports = function (passport) {
  passport.use(new LinkedInStrategy({
    clientID: config.linkedin_clientID,
    clientSecret: config.linkedin_clientSecret,
    callbackURL: config.linkedin_callbackURL,
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({ 'linkedin.id': profile.id }, function (err, user) {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, user)
        } else {
          // if there is no user found with that facebook id, create them
          const u = {
            linkedin: {
              id: profile.id,
              displayName: profile.displayName ? profile.displayName : '',
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
  }))
}
