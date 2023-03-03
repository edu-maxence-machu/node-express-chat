const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  sessionid: { type: String, required: true },
  userid: { type: String, required: true },
  pseudo: { type: String, required: false },
});

module.exports = mongoose.model("Message", messageSchema);
