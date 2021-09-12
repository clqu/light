const mongoose = require("mongoose");
module.exports = mongoose.model("premium-activitaion", new mongoose.Schema({ 
  kod: String,
  creator: String,
  date: String,
}));
