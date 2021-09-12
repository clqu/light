const mongoose = require("mongoose");
module.exports = mongoose.model("partner-post", new mongoose.Schema({ 
  message: String,
  guildID: String,
  karsiSunucu: String,
  author: String,
}));