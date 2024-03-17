const mongoose = require('mongoose');

const intruderSchema = new mongoose.Schema({
  intruder_image_base64: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  emotion: {
    type: String,
  },
});

const Intruders = mongoose.model('Intruder', intruderSchema);

module.exports = Intruders;