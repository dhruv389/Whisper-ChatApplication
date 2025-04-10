const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  secretKey: String,
  message: String,
  email: String,
  name: String,
  imageLink: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);

