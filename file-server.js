var express = require("express");
var path = require("path")
var config = require("./config.json")
var fs = require("fs")
const { lstatSync } = require('fs')
var cors = require('cors')
var multer = require('multer')
var app = express();
app.use(cors())

var localPath = config.env[process.platform].localPath;
var slash = config.env[process.platform].slash;
var portNumber = 8080;

const isDirectory = source => lstatSync(source).isDirectory()

var customStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // TODO read path from request too
      cb(null, localPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
var upload = multer({ storage: customStorage })

// Maybe in the future, you would want to have a path for each user.
function buildPath(relPath) {
    return path.join(localPath, relPath) ;
}

function appendSlash(path, fName) {
    if (path.charAt(path.length-1) === slash) {
        return path+fName;
    } else {
        return path+slash+fName;
    }
}

function getFilesFromLocalPath(filePath, res, callback) {
    fs.readdir(filePath, (_, fileNames) => {
        var files = fileNames.map(fName => {
            var file = {}
            file["isDirectory"] = isDirectory(appendSlash(filePath.toString(),fName));
            file["fileName"] = fName;
            return file;
        })
        callback(res, files);
    })
}

// Identify the type of file 4 type : pdf, normal file , folder
function fileIdentifier() {

}

function handleFileListResult(res, files) {
    // make json out of this.
    var obj = {};
    obj["result"] = files
    res.send(JSON.stringify(obj));
}

// Maybe give us folder here
app.get(config.api.getFolder, (req, res) =>  {
    var path = typeof(req.query.path) === "undefined" ? "" : req.query.path;
    var absPath = buildPath(path);
    getFilesFromLocalPath(absPath, res, handleFileListResult)
});

// upload file
app.post(config.api.upload, upload.any(),  (req, res)  => {
    res.status(204).end();
});

app.get(config.api.download, (req,res) => {
    var path = typeof(req.query.path) === "undefined" ? "" : req.query.path;
    var absPath = buildPath(path);
    res.sendFile(absPath);
})

app.listen(portNumber, () => {
    console.log(`Example app listening at http://localhost:8080`)
})
