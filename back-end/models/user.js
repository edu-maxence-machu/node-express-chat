const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  connected: { type: Boolean, required: false },
  profil_pic: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);