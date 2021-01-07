const UserModel = require('../models/users.model')

const crypto = require('crypto')

exports.insert = async (req, res) => {
  let secret = crypto.randomBytes(16).toString('base64')
  let hash = crypto.createHmac('sha512', secret).update(req.body.password).digest('base64')
  req.body.password = secret + '$' + hash
  req.body.permissionLevel = 1
  const result = await UserModel.createUser(req.body)
  res.status(201).send({ id: result._id })
}

exports.getById = async (req, res) => {
  const result = await UserModel.findById(req.params.userId)
  res.status(200).send(result)
}

// Use the PATCH operation since it will enable us to send only the fields we want to change
exports.patchById = async (req, res) => {
  if (req.body.password) {
    let secret = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', secret).update(req.body.password).digest('base64')
    req.body.password = secret + '$' + hash
  }
  const result = await UserModel.patchUser(req.params.userId, req.body)
  res.status(204).send({})
}

exports.list = async (req, res) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10
  let page = 0
  if (req.query) {
    if (req.query.page) {
      req.query.page = parent(req.query.page)
      page = Number.isInteger(req.query.page) ? req.query.page : 0
    }
  }
  const result = await UserModel.list(limit,page)
  res.status(200).send(result)
}

exports.removeById = async (req,res)=>{
  await UserModel.removeById(req.params.userId)
  res.status(204).send({})
}