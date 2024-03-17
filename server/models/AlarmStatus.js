const mongoose = require('mongoose');

// Define schema
const systemStatus = new mongoose.Schema({
  systemStatus : {
    type: String,
  }
});

// Create model
const Status = mongoose.model('Status', systemStatus);

module.exports = Status;
