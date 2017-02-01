// set up ========================
var express = require('express');
var app = express();                            //create app with express
var bodyParser = require('body-parser');         //pull information from POST


// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
console.log(__dirname);
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json


//require oAuth =================
var oAuth = require('./yelp/oauth.js');

//require keys
var yelpKeys = require('./keys.js');


//set up api call ================
var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey : yelpKeys.consumerKey,
  consumerSecret : yelpKeys.consumerSecret,
  accessToken : yelpKeys.accessToken,
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret : yelpKeys.accessTokenSecret,
  serviceProvider : {
    signatureMethod : yelpKeys.serviceProvider.signatureMethod
    }

}

var terms = 'food';
var near = '944 Market Street, San+Francisco';
var accessor = {
  consumerSecret : auth.consumerSecret,
  tokenSecret : auth.accessTokenSecret
};
parameters = [];
parameters.push(['term', terms]);
parameters.push(['radius_filter', 200]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', auth.signatureMethod]);

var message = {
  'action' : 'http://api.yelp.com/v2/search',
  'method' : 'GET',
  'parameters' : parameters
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
console.log('paramterMap:  ', parameterMap);

$.ajax({
  'url' : message.action,
  'data' : parameterMap,
  'cache' : true,
  'dataType' : 'jsonp',
  'jsonpCallback' : 'cb',
  'success' : function(data, textStats, XMLHttpRequest) {
    for(var i = 0; i < 10; i++) {
      $('body').append('<div>' + data.businesses[i].name + '</div>' +
      '<img src="' + data.businesses[i].rating_img_url + '"></img>' + '<br/>' +
      '<img src="' + data.businesses[i].image_url + '"></img>');
    }
  console.log('data: ', data);
  }
});

// listen (start app with node server.js) ======================================
var port = 8080
app.listen(port, function() {
  console.log('App is listening on port ', port);
});
