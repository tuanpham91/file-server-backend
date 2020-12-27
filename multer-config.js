var multer = require('multer')
var config = require("./config.json")
var localPath = config.env[process.platform].localPath;

// TODO : cb is a call back
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // TODO read path from request too
      cb(null, localPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
var upload = multer({ storage: storage })

module.exports = {
    upload,
}