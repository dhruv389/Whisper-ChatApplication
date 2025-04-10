const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  imageLink: String,
  bio: String,
  secretKey: String
});

module.exports = mongoose.model('User', userSchema);
