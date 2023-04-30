const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {type : String, required : true},
  owner : {type : String, required : true},
  cost : {type : String, required : true},
  desc : {type : String, required : true},
});

module.exports = mongoose.model('Product',productSchema);
