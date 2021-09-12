const mongoose = require("mongoose");
module.exports = mongoose.model("coin", new mongoose.Schema({ 
  userID: String,
  amount: {type: Number, default: 0}
}));
