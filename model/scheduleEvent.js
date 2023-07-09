const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleEventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const ScheduleEvent = mongoose.model('ScheduleEvent', scheduleEventSchema);

module.exports = ScheduleEvent;
