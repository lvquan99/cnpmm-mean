/*
Before we can secure the users module by implementing the permission and validation middleware,
 we’ll need to be able to generate a valid token for the current user. 
 We will generate a JWT in response to the user providing a valid email and password. 
 JWT is a remarkable JSON web token that you can use to have the user securely make several requests 
 without validating repeatedly. It usually has an expiration time, and a new token is recreated 
 every few minutes to keep the communication secure. For this tutorial, though, 
 we will forgo refreshing the token and keep it simple with a single token per login.
*/


// Before we engage the controller, we should validate the user in
const UserModel = require('../../users/models/users.model')
const crypto = require('crypto')

exports.hasAuthValidFields = (req, res, next) => {
  let errors = []
  if (req.body) {
    if (!req.body.email) {
      errors.push('Missing email field')
    }
    if (!req.body.password) {
      errors.push('Missing password field')
    }
    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') })
    } else {
      return next()
    }
  } else {
    return res.status(400).send({ errors: 'Missing email and password fields' });
  }
}

exports.isPasswordAndEmailMatch = async (req, res, next) => {
  const user = await UserModel.findByEmail(req.body.email)
  if (user.length == 0) return res.status(404).send({})
  let passwordFields = user[0].password.split('$')
  let secret = passwordFields[0]
  let hash = crypto.createHmac('sha512', secret).update(req.body.password).digest('base64')
  if (hash === passwordFields[1]) {
    req.body = {
      userId: user[0]._id,
      email: user[0].email,
      permissionLevel: user[0].permissionLevel,
      provider: 'email',
      name: user[0].firstName + ' ' + user[0].lastName,
    }
    return next()
  } else {
    return res.status(400).send({ errors: ['Invalid email or password'] })
  }
}
