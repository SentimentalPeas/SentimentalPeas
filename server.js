// set up ========================
var express = require('express');
var app = express();                            //create app with express
var bodyParser = require('body-parser');         //pull information from POST


// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

//require keys
var yelpKeys = require('./keys.js');

/* require the modules needed */
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

 var requestYelp = function(set_parameters, callback) {

   /* The type of request */
   var httpMethod = 'GET';

   /* The url we are using for the request */
   var url = 'http://api.yelp.com/v2/search';

   /* We can setup default parameters here */
   var default_parameters = {
     location: 'San+Francisco',
     sort: '2'
   };

   /* We set the require parameters here */
   var required_parameters = {
     oauth_consumer_key : yelpKeys.consumerKey,
     oauth_token : yelpKeys.accessToken,
     oauth_nonce : n(),
     oauth_timestamp : n().toString().substr(0,10),
     oauth_signature_method : 'HMAC-SHA1',
     oauth_version : '1.0'
   };

   /* We combine all the parameters in order of importance */ 
   var parameters = _.assign(default_parameters, set_parameters, required_parameters);

   /* We set our secrets here */
   var consumerSecret = yelpKeys.consumerSecret;
   var tokenSecret = yelpKeys.accessTokenSecret;

   /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
   /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
   var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

   /* We add the signature to the list of paramters */
   parameters.oauth_signature = signature;

   /* Then we turn the paramters object, to a query string */
   var paramURL = qs.stringify(parameters);

   /* Add the query string to the url */
   var apiURL = url+'?'+paramURL;

   /* Then we use request to send make the API Request */
   request(apiURL, function(error, response, body){
     return callback(error, response, body);
   });

 };



//CALL FUNCTION BELOW FOR TESTING
var params = {
  location: 'san francisco, ca',
  term: 'food',
  limit: 10
};

//Post method route where if there is no address provided then we are going to feed params as defailt value.
app.post('/api/restaurants', function (req, res){
  console.log(req.body);
  var reqParameters = function(){
    if (req.body.address) {
      return {
        location: req.body.address,
        term: 'food',
        limit: 10
      }
    } else {
      return params;
    }
  }
  requestYelp(reqParameters(), function(err, response, body){
    //console.log(body);
    res.send(body);
  });
});

//POST for staging to friends
app.post('/api/restaurants/stageToFriends', function (req, res){
  console.log(req.body);
  // requestYelp(req.body, function(err, response, body){
  //   //console.log(body);
  //   res.send(body);
  // });
});

//Tracking total number of votes and total for each of 3 choices
var total1 = 0;
var total2 = 0;
var total3 = 0;
var totalVotes = 0;

//Different endpoints for 3 friends
app.post('/api/1', function (req, res){
  var vote = req.body.vote;
  console.log(req.body);
  if(vote === '1') total1++;
  if(vote === '2') total2++;
  if(vote === '3') total3++;
  totalVotes++;
  return totalCheck(res);
});

app.post('/api/2', function (req, res){
  var vote = req.body.vote;
  if(vote === '1') total1++;
  if(vote === '2') total2++;
  if(vote === '3') total3++;
  totalVotes++;
  totalCheck(res);
});

app.post('/api/3', function (req, res){
  var vote = req.body.vote;
  if(vote === '1') total1++;
  if(vote === '2') total2++;
  if(vote === '3') total3++;
  totalVotes++;
  totalCheck(res);
})

function totalCheck(res){
  console.log("totalVotes: " + totalVotes);
  if(totalVotes === 3){
    //Need to redirect to results page
  }
  res.sendStatus(200);
}



// listen (start app with node server.js) ======================================
var port = 8080
app.listen(port, function() {
  console.log('App is listening on port ', port);
});
