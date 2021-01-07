const mongoose = require('../../common/services/mongoose.service').mongoose

const Schema = mongoose.Schema

const userSchema = Schema({
  photoURL: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  permissionLevel: Number,
  fb: {
    id: String,
    displayName: String,
  },
  google: {
    id: String,
    displayName: String,
  },
  github: {
    id: String,
    displayName: String,
  },
  linkedin: {
    id: String,
    displayName: String,
  },
  amazon: {
    id: String,
    displayName: String,
  },
})

// Create a virtual property `id` 
userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})


// Create a virtual property `fullName` with a getter and setter.
userSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`
  })
  .set(function () {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
  })

// Ensure virtual fields are serialised
userSchema.set('toJSON', {
  virtuals: true
})

// Attach the schema to the user model.
const User = mongoose.model('Users', userSchema)

exports.createUser = (userData) => {
  const user = new User(userData)
  return user.save()
}


exports.findById = async (id, aaa) => {
  let result = await User.findById(id)
  result = result.toJSON()
  delete result._id
  delete result.__v
  return result
}

exports.findByEmail = (email) => {
  return User.find({ email: email })
}

exports.patchUser = (id, userData) => {
  return User.findOneAndUpdate({
    _id: id
  }, userData)
}

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (error, users) {
        error ? reject(error) : resolve(users)
      })
  })
}

exports.removeById = (userId) => {
  return new Promise((resolve, reject) => {
    User.deleteOne({ _id: userId }, (err) => {
      err ? reject(err) : resolve(userId)
    })
  })
}

exports.User = User;