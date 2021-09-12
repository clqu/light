const mongoose = require("mongoose");
module.exports = mongoose.model("gecmis", new mongoose.Schema({ 
  userID: String,
  gecmis: Array
}));
