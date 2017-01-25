var express = require('express')
var app = express();
var mongoose = require('mongoose');                                 // mongoose for mongodb
var morgan = require('morgan');                                     // log requests to the console (express4)
var bodyParser = require('body-parser');                            // pull information from HTML POST (express4)
var methodOverride = require('method-override');                    // simulate DELETE and PUT (express4)
var ig = require('instagram-node').instagram();
var assets = require("connect-assets");
var Todo = require("./models/mongo_model").Item;

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(assets());

mongoose.connect('mongodb://localhost/test');                       // connect to mongoDB database on modulus.io

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongoose connected!")
  // we're connected!
});


// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
ig.use({ client_id: 'f5285f6d8c68488eb9c2236f17eec121', client_secret: '118b61fae4064840ab8c6f98e419ccfe' });
var redirect_uri = 'http://localhost:8000/oauth/done';

exports.authorize_user = function(req, res) {
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!');
    }
  });
};

  //Todos
  var api_todo = require('./api/todo.js');

  app.get('/api/todos', api_todo.getAll);
  app.post('/api/todos', api_todo.addTodo);
  app.delete('/api/todos/:todo_id', api_todo.removeTodo);


  // application -------------------------------------------------------------
  app.get('/', function(req, res) {
      res.sendFile('~/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

  // This is where you would initially send users to authorize 
  app.get('/authorize_user', exports.authorize_user);

  // This is your redirect URI 
  app.get('/oauth/done', exports.handleauth);

// listen (start app with node server.js) ======================================
app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
