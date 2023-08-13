const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleWishSchema = new mongoose.Schema({
  wishCard: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    required: true,
  },
  wishDate: {
    type: Date,
    required: true,
  },
  wishTime: {
    type: String,
    required: true,
  },

  recipientEmail: {
    type: String,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Wish = mongoose.model('Wish', scheduleWishSchema);

module.exports = Wish;
