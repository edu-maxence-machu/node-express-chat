const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  password: { type: Number, required: true },
  connected: { type: Boolean, required: true },
  profil_pic: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);