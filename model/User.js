const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: false // Optional field
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiration: {
    type: Date,
    default: undefined
  },
  refreshToken: {
    type: String
  },
  token: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
