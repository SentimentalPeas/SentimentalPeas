// set up ========================
var express = require('express');
var app = express();                            //create app with express
var bodyParser = require('body-parser');         //pull information from POST


// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

//configure Yelp
var Yelp = require('./yelp.js');

//configure Twilio
var Twilio = require('./twilio.js').Twilio;

var data = {};

//default params that could be used
const params = {
  location: 'san francisco, ca',
  term: 'food',
  limit: 10
};

//Post method route where if there is no address provided then we are going to feed params as defailt value.
app.post('/api/restaurants', (req, res) => {
  console.log(req.body);
  const reqParameters = () => {
    if (req.body.address) {
      return {
        location: req.body.address,
        term: 'food',
        limit: 10
      }
    } else {
      return params;
    }
  };

  Yelp.requestYelp(reqParameters(), (err, response, body) => {
    res.send(body);
  });

});


//POST for staging to friends
app.post('/api/stageToFriends', (req, res) => {
  data = req.body;
  console.log('VOTE OPTION 1:', data.options[0].name);
  console.log('VOTE OPTION 2:', data.options[1].name);
  console.log('VOTE OPTION 3:', data.options[2].name);
  console.log('VOTING HAS STARTED!');

  for (let i = 0; i < data.contacts.length; i++) {
    Twilio.messages.create({
      to: data.contacts[i][1],
      from: "+14152003392",
      body: `...\n\n${data.event.fullName} has invited you to lunch today at ${data.event.time}!\n\nReply with Vote:\n\nA - ${data.options[0].name}\nB - ${data.options[1].name}\nC - ${data.options[2].name}`
    }, (err, message) => {
      if (err) {
        console.log('ERROR - sending vote text: ', err);
      } else {
        console.log('Message:', message);
        console.log(`Current Votes: A-${data.options[0].votes} B-${data.options[1].votes} C-${data.options[2].votes}`);
      }
    });
  }

  // After a set time, pick a winner and notify contacts
  setTimeout(() => {
    pickWinner();
  }, 1000 * 60 * 1);

  var pickWinner = function pickWinner() {
    // Sort by votes
    data.options.sort((a, b) => b.votes - a.votes);
    console.log('data.options[0]:  ', data.options[0]);
    data.winner = data.options[0];
    for (let _i = 0; _i < data.contacts.length; _i++) {
      Twilio.messages.create({
        to: data.contacts[_i][1],
        from: "+14152003392",
        body: `...\n\nFINAL RESULTS: \n\nWe have a winner!\n\n${data.options[0].name} (${data.options[0].votes} votes)\n\nRestaurant:  \n\n${data.options[0].mobile_url}`
      }, (err, message) => {
        console.log(`Final Votes: A-${data.options[0].votes} B-${data.options[1].votes} C-${data.options[2].votes}`);
      });
    }
  };

  res.send('Check your phones!');
});


// Accept SMS Replies here and add to votes
app.post('/sms', (req, res) => {
  
  if (req.body.Body.toUpperCase() === 'A') {
    data.options[0].votes++;
  } else if (req.body.Body.toUpperCase() === 'B') {
    data.options[1].votes++;
  } else if (req.body.Body.toUpperCase() === 'C') {
    data.options[2].votes++;
  }

  console.log(`Current Votes: A-${data.options[0].votes} B-${data.options[1].votes} C-${data.options[2].votes}`); 
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end('Tester');
});

// API to check if we have a winner yet
app.get('/api/voting', (req, res) => {
  let content;
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
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('App is totally listening on port ', port);
});