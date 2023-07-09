const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  friendName: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
