const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: [String], required: true }
});

module.exports = mongoose.model('Site', siteSchema);
