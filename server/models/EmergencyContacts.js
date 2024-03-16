const mongoose = require('mongoose');

// Define schema
const EmergencyContactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  }
});

// Create model
const EmergencyContacts = mongoose.model('EmergencyContacts', EmergencyContactsSchema);

module.exports = EmergencyContacts;
