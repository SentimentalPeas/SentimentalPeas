// set up ========================
var express = require('express');
var app = express();                            //create app with express
var bodyParser = require('body-parser')         //pull information from POST


// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json





// listen (start app with node server.js) ======================================
var port = 8080
app.listen(port, function() {
  console.log('App is listening on port ', port);
});
