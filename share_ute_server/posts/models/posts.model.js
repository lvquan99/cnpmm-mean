const mongoose = require('../../common/services/mongoose.service').mongoose

const Schema = mongoose.Schema

const postSchema = Schema({
  userId: String,
  photoURL: String,
  fullName: String,
  title: String,
  fileURL: String,
  fileName: String,
  fileType: String,
  fileSize: String,
  dateCreated: String,
  likes: Array
})

// Create a virtual property `id` 
postSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Ensure virtual fields are serialised
postSchema.set('toJSON', {
  virtuals: true
})


// Attach the schema to the post model.
const Post = mongoose.model('Posts', postSchema)


exports.createPost = (postData) => {
  const post = new Post(postData)
  return post.save()
}


exports.findById = async (id, aaa) => {
  let post = await Post.findById(id)
  post = post.toJSON()
  delete post._id
  delete post.__v
  return post
}


exports.patchPost = (id, postData) => {
  return Post.findOneAndUpdate({
    _id: id
  }, postData)
}

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Post.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (error, posts) {
        error ? reject(error) : resolve(posts)
      })
  })
}

exports.removeById = (postId) => {
  return new Promise((resolve, reject) => {
    Post.deleteOne({ _id: postId }, (err) => {
      err ? reject(err) : resolve(postId)
    })
  })
}

exports.Post = Post;