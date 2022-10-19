const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  text: { type: String, required: true },
  userid :{ type: String, required: true},
  timestamp : { type: Date, required: true},
});

module.exports = mongoose.model('Message', messageSchema);