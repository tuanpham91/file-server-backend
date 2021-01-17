var express = require("express");
var path = require("path")
var config = require("./config.json")
var fs = require("fs")
const { lstatSync } = require('fs')
var cors = require('cors')
var multer = require('multer')
var app = express();    
app.use(cors())
app.use(express.json());

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
    var absPath = buildPath(filePath);
    fs.readdir(absPath, (_, fileNames) => {
        if (typeof fileNames === "undefined") {
            callback(res, [])
        } else {
        var files = fileNames.map(fName => {
            var file = {}
            file["isDirectory"] = isDirectory(appendSlash(absPath.toString(),fName));
            file["fileName"] = fName;
            file["filePath"] = path.join(filePath, fName)
            return file;
        })
        callback(res, files);
        }
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
    getFilesFromLocalPath(path, res, handleFileListResult)
});

// upload file
app.post(config.api.upload, upload.any(),  (req, res)  => {
    res.status(204).end();
});

// create Folder 
// TODO make path and folderName in query a requirement
app.post(config.api.createFolder, (req, res) => {
    var relPath = typeof(req.query.path) === "undefined" ? "" : req.query.path;
    var folderName =  typeof(req.query.folderName) === "undefined" ? "" : req.query.folderName;
    var localPath = path.join(buildPath(relPath), folderName)
    console.log(folderName)
    if (!fs.existsSync(localPath)){
        fs.mkdirSync(localPath);
    }
    res.status(204).end();
})

//delete file 
app.delete(config.api.delete, (req,res) => {
    var isDirectory = req.body.isDirectory;
    // Read body if folder, then delete folder
    var path = req.query.path;
    if (typeof path === "undefined") {
        // return error
        res.status(404).end();
    } else {
        var absPath = buildPath(path)
        if(isDirectory) {
            fs.rmdirSync(absPath, { recursive: true });
        } else {
            fs.unlinkSync(absPath)
        }
        res.status(200).end();
    }
})

app.get(config.api.download, (req,res) => {
    var path = typeof(req.query.path) === "undefined" ? "" : req.query.path;
    var absPath = buildPath(path);
    res.sendFile(absPath);
})

app.listen(portNumber, () => {
    console.log(`Example app listening at http://localhost:8080`)
})
