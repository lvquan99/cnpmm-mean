const config = require('./common/config/env.config')
const cors = require('cors')
const express = require('express')
const multer = require('multer')
const app = express()
app.use(cors())
var fileExtension = require('file-extension')
const bodyParser = require('body-parser')
app.use((express.static('storage/avatars')))
app.use((express.static('storage/files')))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

const AuthorizationRouter = require('./authorization/routes.config')
const UserRouter = require('./users/routes.config')
const PostRouter = require('./posts/routes.config')

// passport region 
const session = require('express-session')
const passport = require('passport')
app.use(session({
  secret: 'keyboard cat',
  key: 'sid',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const PassportRouter = require('./passport/routes.config')
PassportRouter(passport)
// end passport region


// up load image
var storage = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    cb(null, 'storage/avatars')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
})

var upload = multer({
  storage: storage,
  limits: {
      // Setting Image Size Limit to 2MBs
      fileSize: 2000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          //Error 
          cb(new Error('Please upload JPG and PNG images only!'))
      }
      //Success 
      cb(undefined, true)
  }
})
// end upload image region

app.post('/api/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
  const file = req.file
  if (!file) {
      const error = new Error('Please upload a file')
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

//
app.use(bodyParser.json())
AuthorizationRouter.routeConfig(app)
UserRouter.routesConfig(app)
PostRouter.routesConfig(app)

app.listen(config.port, function () {
  console.log('App listening at port %s', config.port)
})