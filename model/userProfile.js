const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
  },
  name: {
  type: String,
  required: true
  },
  bio: {
  type: String
  },
  interests: {
  type: String
  },
  phone: {
    type: String
    },
  email: {
  type: String,
  required: true,
  },

  address: {
    type: String,
    required: true,
    },
  profilePic: {
    type: String
    }
  
  });
  const UserProfile = mongoose.model('UserProfile', userProfileSchema);
  module.exports = UserProfile;