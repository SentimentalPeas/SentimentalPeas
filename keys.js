//yelp keys
var yelpKeys = {
  consumerKey : "LCZuw2ApIUGD2LI_SAlHEg",
  consumerSecret : "aKNzBDLkAHXhwl3-Dr71ZZGGSPA",
  accessToken : "CRjf-vVxfBaoh0sZTmEf5QExq5YSvMck",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret : "aMAlHYdI0NCwkovkYWlu2pmZ_jo",
  serviceProvider : {
    signatureMethod : "HMAC-SHA1"
  }
}

var twilioKeys = {
  accountSid : 'AC64050c8593792fda33626318cbbf2bf5', 
  authToken : '23043b0200b3181ad7c583c3f2e8e899' 
}

module.exports = yelpKeys;
module.exports = twilioKeys;