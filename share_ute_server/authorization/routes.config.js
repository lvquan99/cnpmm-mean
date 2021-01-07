const VerifyUserMiddleware = require('./middlewares/verify.user.middleware')
const AuthorizationController = require('./controllers/authorization.controller')
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
const passport = require('passport')

exports.routeConfig = function (app) {


  app.post('/api/auth', [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndEmailMatch,
    AuthorizationController.login
  ])

  app.post('/api/auth/refresh', [
    AuthValidationMiddleware.validJWTNeeded,
    AuthValidationMiddleware.verifyRefreshBodyField,
    AuthValidationMiddleware.validRefreshNeeded,
    AuthorizationController.login
  ])

  app.get('/api/facebook/auth', [
    AuthorizationController.loginFacebook
  ])

  // Facebook Auth
  app.get('/api/auth/facebook', passport.authenticate('facebook'));

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      req.body = {
        userId: req.user._id,
        email: '',
        permissionLevel: 1,
        provider: 'facebbok',
        name: req.user.fb.displayName,
      }
      let accessToken = AuthorizationController.generateToken(req, res)
      accessToken = accessToken + '@123'
      res.redirect('http://localhost:4200/home/?' + accessToken);
    });

  // Google Auth
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })
  )

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      req.body = {
        userId: req.user._id,
        email: '',
        permissionLevel: 1,
        provider: 'google',
        name: req.user.google.displayName,
      }
      let accessToken = AuthorizationController.generateToken(req, res)
      accessToken = accessToken + '@123'
      res.redirect('http://localhost:4200/home/?' + accessToken);
    });

  // Github Auth
  app.get('/api/auth/github', passport.authenticate('github'));

  app.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
      req.body = {
        userId: req.user._id,
        email: '',
        permissionLevel: 1,
        provider: 'github',
        name: req.user.github.displayName,
      }
      let accessToken = AuthorizationController.generateToken(req, res)
      accessToken = accessToken + '@123'
      res.redirect('http://localhost:4200/home/?' + accessToken);
    });

  // LinkedIn Auth

  // Github Auth
  app.get('/api/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE' }),
    function (req, res) {
      // The request will be redirected to LinkedIn for authentication, so this
      // function will not be called.
    });

  app.get('/api/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function (req, res) {
      req.body = {
        userId: req.user._id,
        email: '',
        permissionLevel: 1,
        provider: 'linkedin',
        name: req.user.linkedin.displayName,
      }
      let accessToken = AuthorizationController.generateToken(req, res)
      accessToken = accessToken + '@123'
      res.redirect('http://localhost:4200/home/?' + accessToken);
    });

  // Amazon Auth
  app.get('/api/auth/amazon',
    passport.authenticate('amazon', { scope: ['profile'] }));

  app.get('/api/auth/amazon/callback',
    passport.authenticate('amazon', { failureRedirect: '/login' }),
    function (req, res) {
      req.body = {
        userId: req.user._id,
        email: '',
        permissionLevel: 1,
        provider: 'amazon',
        name: req.user.amazon.displayName,
      }
      let accessToken = AuthorizationController.generateToken(req, res)
      accessToken = accessToken + '@123'
      res.redirect('http://localhost:4200/home/?' + accessToken);
    });
}