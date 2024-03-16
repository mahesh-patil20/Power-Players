const mongoose = require('mongoose');

// Define schema
const allowedUserListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  image: {
    type: String, // Assuming you will store image URLs
    required: true
  }
});

// Create model
const AllowedUserList = mongoose.model('AllowedUserList', allowedUserListSchema);

module.exports = AllowedUserList;
