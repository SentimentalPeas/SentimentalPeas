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

/* require the modules needed */
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

/* CONVERTING TO A NODE STYLE API CALL
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

oAuth.setTimestampAndNonce(message);
oAuth.SignatureMethod.sign(message, accessor);
var parameterMap = oAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = oAuth.percentEncode(parameterMap.oauth_signature);
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
CONVERSION BELOW DELETE ABOVE CODE WHEN READY*/


/* Function for yelp call
 * ------------------------
 * setParameters: object with params to search
 * callback: callback(error, response, body)
 */
var requestYelp = function(setParameters, callback) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  var url = 'http://api.yelp.com/v2/search';

  /* We can setup default parameters here */
  var defaultParameters = {
    location: 'San+Francisco',
    sort: '2'
  };

  /* We set the require parameters here */
  var requiredParameters = {
    oauth_consumer_key : yelpKeys.consumerKey,
    oauth_token : yelpKeys.accessToken,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauthVersion : '1.0'
  };

  /* We combine all the parameters in order of importance */ 
  var parameters = _.assign(defaultParameters, setParameters, requiredParameters);
  console.log('combined paramaters line 52', parameters);
  /* We set our secrets here */
  var consumerSecret = yelpKeys.consumerSecret;
  var tokenSecret = yelpKeys.tokenSecret;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;
  console.log('parameters line 63', parameters);
  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);
  console.log('paramURL ', paramURL)

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;

  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });

};
var terms = 'food';
var near = '944 Market Street, San+Francisco';

//CALL FUNCTION BELOW FOR TESTING
// requestYelp(params, function(err, response, body) {
//   if (err) {
//     console.log('ERR in API CALL', err)
//   } else {
//     console.log(response.body);
//   }
// });








// listen (start app with node server.js) ======================================
var port = 8080
app.listen(port, function() {
  console.log('App is listening on port ', port);
});
