const jwtSecret = require('../../common/config/env.config').jwt_secret
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

exports.login = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret
    let secret = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', secret).update(refreshId).digest('base64')
    req.body.refreshKey = secret
    // use jwt.sign and jwt.verify to validate
    let token = jwt.sign(req.body, jwtSecret, { expiresIn: '180s' })
    // Buffer objects are used to represent a fixed-length sequence of bytes
    let b = Buffer.from(hash)
    let refresh_token = b.toString('base64')
    console.log('Authenticate user sucessfully!')
    console.log({ accessToken: token, refreshToken: refresh_token })
    res.status(201).send({ accessToken: token, refreshToken: refresh_token })
  } catch (error) {
    res.status(500).send({ errors: err })
  }
}

exports.loginFacebook = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret
    let secret = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', secret).update(refreshId).digest('base64')
    req.body.refreshKey = secret
    // use jwt.sign and jwt.verify to validate
    let token = jwt.sign(req.body, jwtSecret, { expiresIn: '180s' })
    // Buffer objects are used to represent a fixed-length sequence of bytes
    let b = Buffer.from(hash)
    let refresh_token = b.toString('base64')
    res.status(201).send({ accessToken: token, refreshToken: refresh_token })
  } catch (error) {
    res.status(500).send({ errors: err })
  }
}

exports.generateToken = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret
    let secret = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', secret).update(refreshId).digest('base64')
    req.body.refreshKey = secret
    // use jwt.sign and jwt.verify to validate
    let token = jwt.sign(req.body, jwtSecret, { expiresIn: '180s' })
    // Buffer objects are used to represent a fixed-length sequence of bytes
    let b = Buffer.from(hash)
    let refresh_token = b.toString('base64')
    console.log('Authenticate user sucessfully!')
    console.log({ accessToken: token, refreshToken: refresh_token })
    return token
  } catch (error) {
    return error
  }
}


exports.refresh_token = (req, res) => {
  try {
    req.body = req.jwt
    let token = jwt.sign(req.body, jwtSecret)
    res.status(201).send({ id: token })
  } catch (error) {
    res.status(500).send({ errors: err })
  }
}

