var express = require('express')
var app = express();
var mongoose = require('mongoose');                                 // mongoose for mongodb
var morgan = require('morgan');                                     // log requests to the console (express4)
var bodyParser = require('body-parser');                            // pull information from HTML POST (express4)
var methodOverride = require('method-override');                    // simulate DELETE and PUT (express4)
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

  //Todos
  var api_todo = require('./api/todo.js');

  app.get('/api/todos', api_todo.getAll);
  app.post('/api/todos', api_todo.addTodo);
  app.delete('/api/todos/:todo_id', api_todo.removeTodo);

  //Instagrams
  var instagram = require('./api/instagram.js');

  app.get('/authorize_user', instagram.authorize_user);
  app.get('/oauth/done', instagram.handleauth);

  // application -------------------------------------------------------------
  app.get('/', function(req, res) {
      res.sendFile('~/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

// listen (start app with node server.js) ======================================
app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
