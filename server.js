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
//require twilio keys
var twilioKeys = require('./keys.js')

/* require the modules needed */
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

var data = {};



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
    res.send(body);
  });

});

//POST for staging to friends
app.post('/api/stageToFriends', function (req, res){
  data = req.body;
  console.log('VOTE OPTION 1:', data.options[0].name);
  console.log('VOTE OPTION 2:', data.options[1].name);
  console.log('VOTE OPTION 3:', data.options[2].name);


  console.log('VOTING HAS STARTED!');
  var accountSid = 'AC64050c8593792fda33626318cbbf2bf5'; 
  var authToken = '23043b0200b3181ad7c583c3f2e8e899'; 
   
  //require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 

  for (var i = 0; i < data.contacts.length; i++) {
    client.messages.create({ 
        to: data.contacts[i][1], 
        from: "+14152003392", 
        body: '...\n\n' + data.event.fullName + ' has invited you to lunch today at ' + data.event.time + '!\n\nReply with Vote:\n\nA - ' + data.options[0].name + '\nB - ' + data.options[1].name + '\nC - ' + data.options[2].name, 
    }, function(err, message) { 
        if (err) {
          console.log('ERROR - sending vote text: ', err);
        } else {
          console.log('Message:', message);
          console.log('Current Votes: A-' + data.options[0].votes + ' B-' + data.options[1].votes + ' C-' + data.options[2].votes); 
        }
    });
  }   


  // After a set time, pick a winner and notify contacts
  setTimeout(function(){ 
    pickWinner();
  }, 1000 * 60 * 1);

  var pickWinner = function() {

    // Sort by votes
    data.options.sort(function(a, b) {
        return b.votes - a.votes;
    });

    data.winner = data.options[0];

    for (var i = 0; i < data.contacts.length; i++) {
    client.messages.create({ 
        to: data.contacts[i][1], 
        from: "+14152003392", 
        body: '...\n\nFINAL RESULTS: \n\nWe have a winner!\n\n' + data.options[0].name + ' (' + data.options[0].votes + ' votes)\n\n',
    }, function(err, message) { 
        console.log('Final Votes: A-' + data.options[0].votes + ' B-' + data.options[1].votes + ' C-' + data.options[2].votes); 
    });
    } 
  }

  res.send('Check your phones!');

});


// Accept SMS Replies here and add to votes
app.post('/sms', function(req, res) {
  
  if (req.body.Body.toUpperCase() === 'A') {
    data.options[0].votes++;
  } else if (req.body.Body.toUpperCase() === 'B') {
    data.options[1].votes++;
  } else if (req.body.Body.toUpperCase() === 'C') {
    data.options[2].votes++;
  }

  console.log('Current Votes: A-' + data.options[0].votes + ' B-' + data.options[1].votes + ' C-' + data.options[2].votes); 

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end('Tester');
});

// API to check if we have a winner yet
app.get('/api/voting', function(req, res) {
  var content;
  if (data.winner) {
    console.log('We have winner to send to server...', data.winner.name);
    //res.writeHead(200, {'Content-Type': 'application/json'});
    res.json(data);
  } else {
    console.log('No winner yet...');
    res.send('No winner yet...');
  }

  

});



// listen (start app with node server.js) ======================================
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('App is totally listening on port ', port);
});
