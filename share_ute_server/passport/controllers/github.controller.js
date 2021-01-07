const config = require('../../common/config/env.config')
const User = require('../../users/models/users.model').User
const GitHubStrategy = require('passport-github').Strategy

module.exports = function (passport) {
  passport.use(new GitHubStrategy({
    clientID: config.github_clientID,
    clientSecret: config.github_clientSecret,
    callbackURL: config.github_callbackURL,
  },

    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'github.id': profile.id }, function (err, user) {
          if (err) {
            return done(err)
          }
          if (user) {
            return done(null, user)
          } else {
            const u = {
              github: {
                id: profile.id,
                displayName: profile.displayName ? profile.displayName : profile.username
              },
              firstName: '',
              lastName: profile.displayName ? profile.displayName : profile.username,
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