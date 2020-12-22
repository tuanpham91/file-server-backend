var express = require("express");
var path = require("path")
var app = express();
var config = require("./config.json")
var fs = require("fs")

// Maybe in the future, you would want to have a path for each user.
function buildPath(relPath) {
    return path.join(config.env.localPath, relPath) ;
}

function getFilesFromLocalPath(path, res, callback) {
    fs.readdir(path, (err, files) => {
        callback(res, files)
    })
}

function handleFile
// Maybe give us folder here
app.get(config.api.getFolder, function(req, res) {
    var path = req.query.path;
    var localPath = buildPath(path);
    

});