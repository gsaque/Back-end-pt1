const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
  },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
