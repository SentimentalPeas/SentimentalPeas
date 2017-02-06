//require twilio keys
var twilioKeys = require('./keys.js').twilioKeys;

//require the Twilio module and create a REST client 
exports.Twilio = require('twilio')(twilioKeys.accountSid, twilioKeys.authToken); 