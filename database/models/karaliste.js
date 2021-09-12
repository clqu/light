const mongoose = require("mongoose");
module.exports = mongoose.model("karaliste", new mongoose.Schema({ 
  userID: String,
  yetkili: String,
  süre: Date,
  sebep: String,
}));
