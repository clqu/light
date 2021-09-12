const mongoose = require("mongoose");
module.exports = mongoose.model("ekledim-5-sunucuya", new mongoose.Schema({ 
  userID: String,
}));
