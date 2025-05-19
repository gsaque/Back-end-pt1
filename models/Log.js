// models/Log.js
const mongoose = require('mongoose');

// Schema do MongoDB para Logs
const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  message: { type: String },
  error: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;