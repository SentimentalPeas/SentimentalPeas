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

var data = {
  user: {
    firstName: null,
    lastName: null,
    address: null,
    time: null,
    friends: [
    '+14356401931', 
    //'+12404391140',
    //'+15102690993',
    //'+19084157888'
    ]
  },
  voteStatus: 0, // 0 - not started, 1 - in progress, 2 - complete
  voteCount: {
    A: 0,
    B: 0,
    C: 0
  },
  voteOptions: {}
};






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

  data.user.firstName = req.body.firstName;
  data.user.lastName = req.body.lastName;
  data.user.address = req.body.address;
  data.user.time = req.body.time;


  requestYelp(reqParameters(), function(err, response, body){
    //console.log('Data:', data.user.businesses);
    //data.voteAll = body;
    //console.log('YELP:', data.voteAll.businesses[0].name);
    res.send(body);
  });

});

//POST for staging to friends
app.post('/api/restaurants/stageToFriends', function (req, res){
  data.voteOptions = req.body;
  console.log('VOTE OPTION 1:', data.voteOptions[0].name);
  console.log('VOTE OPTION 2:', data.voteOptions[1].name);
  console.log('VOTE OPTION 3:', data.voteOptions[2].name);


  console.log('VOTING HAS STARTED!');
  var accountSid = 'AC64050c8593792fda33626318cbbf2bf5'; 
  var authToken = '23043b0200b3181ad7c583c3f2e8e899'; 
   
  //require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 

  // var phones = [
  //   '+14356401931', 
  //   '+12404391140',
  //   // '+15102690993',
  //   // '+19084157888'
  //   ];



  for (var i = 0; i < data.user.friends.length; i++) {
    client.messages.create({ 
        to: data.user.friends[i], 
        from: "+14152003392", 
        body: '...\n\nBill Lea has invited you to lunch today!\n\nReply with Vote:\n\nA - ' + data.voteOptions[0].name + '\nB - ' + data.voteOptions[1].name + '\nC - ' + data.voteOptions[2].name, 
    }, function(err, message) { 
        //console.log(message.sid); 
        console.log('Current Votes: A-' + data.voteOptions[0].votes + ' B-' + data.voteOptions[1].votes + ' C-' + data.voteOptions[2].votes); 
    });
  }   

  setTimeout(function(){ 
    winner();
  }, 1000 * 60 * 1);

  var winner = function() {


    // Sort by votes
    data.voteOptions.sort(function(a, b) {
        return b.votes - a.votes;
    });

    for (var i = 0; i < data.user.friends.length; i++) {
    client.messages.create({ 
        to: data.user.friends[i],
        from: "+14152003392", 
        body: '...\n\nFINAL RESULTS: \n\nWe have a winner!\n\n' + data.voteOptions[0].name + ' (' + data.voteOptions[0].votes + ' votes)\n\n',
    }, function(err, message) { 
        //console.log(message.sid); 
        console.log('Final Votes: A-' + data.voteOptions[0].votes + ' B-' + data.voteOptions[1].votes + ' C-' + data.voteOptions[2].votes); 
    });
    } 
  }


  res.send('Check your phones!');

  //res.send('hello');
});

app.post('/sms', function(req, res) {
  
  if (req.body.Body.toUpperCase() === 'A') {
    data.voteOptions[0].votes++;
  } else if (req.body.Body.toUpperCase() === 'B') {
    data.voteOptions[1].votes++;
  } else if (req.body.Body.toUpperCase() === 'C') {
    data.voteOptions[2].votes++;
  }

  console.log('Current Votes: A-' + data.voteOptions[0].votes + ' B-' + data.voteOptions[1].votes + ' C-' + data.voteOptions[2].votes); 

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end('Tester');
});


// listen (start app with node server.js) ======================================
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('App is totally listening on port ', port);
});
