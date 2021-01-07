// We will first require a middleware that always validates the user if they are using a valid JWT
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/env.config').jwt_secret
const crypto = require('crypto')

exports.verifyRefreshBodyField = (req, res, next) => {
  if (req.body && req.body.refresh_token) {
    return next()
  } else {
    return res.status(400).send({ error: 'need to pass refresh_token field' });
  }
}

exports.validRefreshNeeded = (req, res, next) => {
  let b = Buffer.from(req.body.refresh_token, 'base64')
  let refresh_token = b.toString()
  let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + jwtSecret).digest('base64')
  if (hash === refresh_token) {
    req.body = req.jwt
    return next()
  } else {
    return res.status(400).send({ error: 'Invalid refresh token' })
  }
}

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ')
      if (authorization[0] !== 'Bearer') {
        return res.status(401).send()
      } else {
        req.jwt = jwt.verify(authorization[1], jwtSecret)
        return next()
      }
    } catch (error) {
      // HTTP 403 for a valid request with an invalid token, or valid token with invalid permissions
      return res.status(403).send();
    }
  } else {
    // HTTP 401 for an invalid request
    return res.status(401).send();
  }
}