var express = require("express");
var path = require("path")
var app = express();
var config = require("./config.json")
var fs = require("fs")
var upload = require('./multer-config')

var localPath = config.env[process.platform].localPath;
var portNumber = 8080;

// Maybe in the future, you would want to have a path for each user.
function buildPath(relPath) {
    return path.join(localPath, relPath) ;
}

function getFilesFromLocalPath(path, res, callback) {
    fs.readdir(path, (_, files) => {
        callback(res, files);
    })
}

function handleFileListResult(res, files) {
    // make json out of this.
    var result = JSON.stringify(files);
    console.log(files);
    res.send(result);
}

// Maybe give us folder here
app.get(config.api.getFolder, function(req, res) {
    var path = typeof(req.query.path) === "undefined" ? "" : req.query.path;
    var absPath = buildPath(path);
    getFilesFromLocalPath(absPath, res, handleFileListResult)
});

// upload file
app.post(config.api.upload, upload,  function(req, res) {
    res.status(204).end();
})

app.listen(portNumber, () => {
    console.log(`Example app listening at http://localhost:8080`)
})
