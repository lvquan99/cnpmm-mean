const UserController = require('./controllers/users.controller')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const config = require('../common/config/env.config')

const ADMIN = config.permissionLevels.ADMIN
const PAID = config.permissionLevels.PAID_USER
const FREE = config.permissionLevels.NORMAL_USER

// app: parameter for express
exports.routesConfig = function(app){
  // Create a user through body
  app.post('/api/users',[
    UserController.insert
  ])

  // Get a user by uid
  app.get('/api/users/:userId',[
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UserController.getById
  ])

  // Update a part of user by uid through body
  app.patch('/api/users/:userId',[
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UserController.patchById
  ])

  // Get all users 
  app.get('/api/users',[
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    UserController.list
  ])

  // Delte a user by uid
  app.delete('/api/users/:userId',[
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UserController.removeById
  ])
}