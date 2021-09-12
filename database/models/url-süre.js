const mongoose = require("mongoose");
module.exports = mongoose.model("url-süre", new mongoose.Schema({ 
guild: String,
ms: Number,
Date: Date
}));
