const mongoose = require("mongoose");
module.exports = mongoose.model("kod-data", new mongoose.Schema({ 
  kod: String,
  usage: { type: Number, default: 0 },
  prize: { type: Number, default: 0 },
  kullanim: { type: Number, default: 0 },
  users: { type: Object, default: [] }
}));
