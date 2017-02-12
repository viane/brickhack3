'use strict'

var http = require('http');
var path = require('path');

var express = require('express');
const appRoot = require('app-root-path');
var app = express();
var server = http.createServer(app);

app.use(require("cors")());

app.use(express.static(path.resolve(__dirname, 'public')));

require(appRoot + '/app/route.js')(app); // Routes

server.listen(8081, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
