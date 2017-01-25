var mongoose = require("mongoose");

var ItemSchema = new mongoose.Schema({
  text: {type: String}
});

var Item = mongoose.model('Todos', ItemSchema);

module.exports = {
  Item: Item
}