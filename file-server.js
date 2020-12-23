var express = require("express");
var path = require("path")
var app = express();
var config = require("./config.json")
var fs = require("fs")

var localPath = config.env[process.platform].localPath
// Maybe in the future, you would want to have a path for each user.
function buildPath(relPath) {
    return path.join(localPath, relPath) ;
}

function getFilesFromLocalPath(path) {
    fs.readdir(path, (_, files) => {
        console.log(files)
        return files;
    })
}

function handleFileListResult(res, files) {
    // make json out of this.
    res.end();
}

// Maybe give us folder here
app.get(config.api.getFolder, function(req, res) {
    var path = req.query.path;
    var absPath = buildPath(path);
    getFilesFromLocalPath(absPath, res, handleFileListResult);
});

// Test : 
getFilesFromLocalPath(buildPath(""))