// requiring dependancies
var _ = require('lodash'),
  twit = require('twit'),
  puny = require('punycode'),
	twitter = new twit({
		  consumer_key:         'DsgLPSlMbzRjn8YaQsRPyn2CO',
		  consumer_secret:      'kG8DCILnTVABXXltqgU6oqcmGH38g4TA0UoMMhw9LCic42z1GU',
		  access_token:         '3328978788-OFHcx34tmQE55xq5q1ULadnkWMzBd2wAwG2PVTK',
		  access_token_secret:  'DEuxocz29DiSCtAxfeIAJyzAKNr8Lva7qckuWMpEkV5Uh'
	});

//
var clientObject = {
  numberOfTweets: null,
  avgTweetSec: null,
  avgTweetMin: null,
  avgTweetHour: null,
  topEmojis: null,
  percentOfTweetsEmojis: null,
  topHashtags: null,
  percentOfTweetsUrl: null,
  percentOfTweetsPhoto: null,
  topDomains: null,
};

//creating variables to keep track of metrics
var countTweets = 1,
 seconds = 1,
 minutes = 1,
 hours = 1,
 hashes = [], //this is an array that stores all the hash tags gathered off of twitter
 domains = [], //this is an array that stores all the domains gathered from tweets
 hashesIndex = 0,
 urlIndex = 0,
 containsURL = 0,
 containsPhoto = 0,
 containsEmoji = 0;

var stream = twitter.stream('statuses/sample');
stream.on('tweet', function(tweet) { 
  if(tweet.lang === 'en'){
      // console.log('___________________________________________________________________');
      // console.log('tweet', tweet.entities.media);
      // console.log('text:', _.split(tweet.text, "", tweet.text.length));
      // console.log('hastags', tweet.entities.hashtags);

      if(typeof tweet.entities.media !== 'undefined') {
        if(tweet.entities.media[0].type === "photo" ){
          containsPhoto++;
        }
      }

      if(tweet.entities.hashtags.length > 0 ) {
        for(i=0;i<tweet.entities.hashtags.length; i++){
          hashes[hashesIndex] = tweet.entities.hashtags[i].text;
          hashesIndex++;
        }
      }

      //this js statement fills our domain array with the domains in the tweets as well as counts the number of tweets that contain a domain
      if(tweet.entities.urls.length > 0 ){
        for(i=0;i<tweet.entities.urls.length; i++){
          var string = tweet.entities.urls[i].display_url;
          domains[urlIndex] = string.split('/')[0]; //returns the url from [0] to first /
          urlIndex++;
        }
        containsURL++;
      }

      
        arrayChar = _.split(tweet.text, "", tweet.text.length);
        newArrayChar = [];
        for(i=0;i<arrayChar.length;i++) {
          if(toUnicode(arrayChar[i]).length > 6){
            // newArrayChar[i] = puny.decode(arrayChar[i]);
            containsEmoji++;
            // console.log("Values", newArrayChar);
          }
        }

      // var res = tweet.text.split("");
      // console.log(res);
  }

  // var res = tweet.text.split("");
  // console.log(res);

  // for (i=0;i<res.length;i++) {
  // 	res[i] = res[i].charCodeAt(i);
  // }

  // console.log(res);
  // process.exit(0);
  countTweets++;
  
});


// *** Function takes and array of hashtags and returns an array of objects that 
// *** have a key (one key for each unique hashtag) and value (number of unique hashtags per key)
// *** The return array is limited to the top 15 hashtags. 
function hashTagValue(arr) {
  var object = _.countBy(arr, _.identity); 
  var arr = [];
  var prop;
  for (prop in object) {
    if (object.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': object[prop]
      });
    }
  }
  arr.sort(function(a, b) {
    return b.value - a.value;
  });

  return arr.slice(0,15); // returns array with only the top 15 hashtags
};

// function takes a character (i.e. 'a') and returns a unicode string from it 
function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
    return unicodeString;
}

setInterval(function () {
  clientObject.numberOfTweets = countTweets;
  clientObject.avgTweetSec = Math.round(countTweets/seconds);
  clientObject.avgTweetMin = Math.round(countTweets/minutes);
  clientObject.percentOfTweetsEmojis = Math.round((containsEmoji/countTweets)*100);
  clientObject.topHashtags = hashTagValue(hashes); 
  clientObject.percentOfTweetsUrl = Math.round((containsURL/countTweets)*100);
  clientObject.percentOfTweetsPhoto = Math.round((containsPhoto/countTweets)*100); 
  clientObject.topDomains = hashTagValue(domains); 
  ++seconds;
}, 1000);

setInterval(function () {
  console.log('________________________________________________________________________')
  console.log('________________________________________________________________________')
  console.log(clientObject);
  ++minutes;
}, 60000);

setInterval(function () {
	console.log('Tweets per hour: ' + Math.round(countTweets/hours));
  ++hours;
}, 3600000);