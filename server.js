// set up ========================
var express = require('express');
var app = express();                            //create app with express
var bodyParser = require('body-parser');         //pull information from POST


// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

//configure yelp
var Yelp = require('./yelp.js')

//require twilio keys
var twilioKeys = require('./keys.js').twilioKeys;

var data = {};

//default params that could be used
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

  Yelp.requestYelp(reqParameters(), function(err, response, body){
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
  // var accountSid = 'AC64050c8593792fda33626318cbbf2bf5'; 
  // var authToken = '23043b0200b3181ad7c583c3f2e8e899'; 
   
  //require the Twilio module and create a REST client 
  var client = require('twilio')(twilioKeys.accountSid, twilioKeys.authToken); 

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
