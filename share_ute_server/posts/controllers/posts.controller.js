const PostModel = require('../models/posts.model')

exports.insert = async (req, res) => {
  const result = await PostModel.createPost(req.body)
  res.status(201).send({ id: result._id })
}

exports.getById = async (req, res) => {
  const result = await PostModel.findById(req.params.postId)
  res.status(200).send(result)
}

exports.patchById = async (req, res) => {
  await PostModel.patchPost(req.params.postId, req.body)
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
  const result = await PostModel.list(limit,page)
  res.status(200).send(result)
}

exports.removeById = async (req,res)=>{
  await PostModel.removeById(req.params.postId)
  res.status(204).send({})
}