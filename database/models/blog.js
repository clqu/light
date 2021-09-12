const mongoose = require("mongoose");
module.exports = mongoose.model("blog", new mongoose.Schema({ 
  date: { type: String, default: Date.now().toString() },
  author: { type: String, default: null },
  title: { type: String, default: null },
  image: { type: String, default: null },
  text: { type: String, default: null }
}));
