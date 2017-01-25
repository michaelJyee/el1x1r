var mongoose = require('mongoose');
var Todo = require("../models/mongo_model").Item;

exports.removeTodo = function(req, res){
  Todo.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if (err)
      res.send(err);
    // get and return all the todos after you create another
    Todo.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
}

exports.addTodo = function(req, res) {
  // create a todo, information comes from AJAX request from Angular
  Todo.create({
    text : req.body.text,
    done : false
  }, function(err, todo) {
      if (err)
          res.send(err);

    // get and return all the todos after you create another
    Todo.find(function(err, todos) {
      if (err)
          res.send(err)
      res.json(todos);
    });
  });
}

exports.getAll = function(req, res) {
  // use mongoose to get all todos in the database
  Todo.find(function(err, todos) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
      res.send(err)
    
    res.json(todos); // return all todos in JSON format
  });
}