'use strict'

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

//serve static files from root
app.use(express.static("wwwroot"));
//parse application/json requests
app.use(bodyParser.json());

//create and handle the webcli route
require("./webcli.js")(app);
//start server
var server = app.listen(5000, function () {
	console.log("listening on port " + server.address().port);
});


