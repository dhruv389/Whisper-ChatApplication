const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  groupTitle: String,
  imageLink: String,
  email: String,
  name: String,
  secretKey: String
});

module.exports = mongoose.model('Owner', ownerSchema);
