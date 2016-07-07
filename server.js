var express = require('express');
var redis = require('redis');

// Create our app
var app = express();
const PORT = process.env.PORT || 3000;

// app.use(function (req, res, next){
//   if (req.headers['x-forwarded-proto'] === 'https') {
//     res.redirect('http://' + req.hostname + req.url);
//   } else {
//     next();
//   }
// });

// // Set up connection to Redis
// var redisConnect, subscribe;
// if (process.env.REDIS_URL) {
//   redisConnect = redis.createClient(process.env.REDIS_URL);
//   subscribe = redis.createClient(process.env.REDIS_URL);
// } else {
//   redisConnect = redis.createClient();
//   subscribe = redis.createClient();
// }

app.use(express.static('public'));

app.listen(PORT, function () {
  console.log('Express server is up on port ' + PORT);
});
