const mongoose = require("mongoose");
module.exports = mongoose.model("bot", new mongoose.Schema({ 
  botID: String,
  partnerCount: {type: Number, default: 0},
  maintence: {type: String, default: "DeActive"},
}));
