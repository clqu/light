const mongoose = require("mongoose");
module.exports = mongoose.model("bakım-modu", new mongoose.Schema({ 
  botID: String,
  yetkili: String,
  süre: Date,
  sebep: String,
}));
