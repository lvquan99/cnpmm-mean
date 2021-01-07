const PostController = require('./controllers/posts.controller')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const config = require('../common/config/env.config')
const multer = require('multer')
var fileExtension = require('file-extension')

const ADMIN = config.permissionLevels.ADMIN
const PAID = config.permissionLevels.PAID_USER
const FREE = config.permissionLevels.NORMAL_USER


exports.routesConfig = function (app) {

  app.post('/api/posts', [
    PostController.insert
  ])

  app.get('/api/posts/:postId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    PostController.getById
  ])

  app.patch('/api/posts/:postId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    PostController.patchById
  ])

  app.get('/api/posts', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PostController.list
  ])

  app.delete('/api/posts/:postId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    PostController.removeById
  ])


  app.post('/api/files', upload.single('uploadedFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file!')
      error.httpStatusCode = 400
      return next(error)
    }
    res.status(200).send({
      statusCode: 200,
      status: 'success',
      uploadedFile: file
    })

  }, (error, req, res, next) => {
    res.status(400).send({
      error: error.message
    })
  })
}

const storage = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    cb(null, 'storage/files')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    // Setting Image Size Limit to 10MBs
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc)$/)) {
      //Error 
      cb(new Error('Please upload PDF and DOC files only!'))
    }
    //Success 
    cb(undefined, true)
  }
})