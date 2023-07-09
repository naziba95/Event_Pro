const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  firstname: {
    type: String,
     required: true
  },
  surname: {
    type: String,
     required: true
  },
  email: {
    type: String,
     required: true
  },
  dateOfBirth: {
    type: Date,
     required: true
  },
});


module.exports = mongoose.model('Customer', customerSchema);