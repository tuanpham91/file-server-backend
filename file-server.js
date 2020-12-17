var express = require("express");

var app = express();
var config = require("./config.json")

// Maybe in the future, you would want to have a path for each user.
function buildPath(path) {
    return path;
}

// Maybe give us folder here
app.get(config.api.getFolder, function(req, res) {
    var path = req.query.path;
    var localPath = buildPath(path);
    

});