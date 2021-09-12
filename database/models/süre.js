const mongoose = require("mongoose");
module.exports = mongoose.model("süre", new mongoose.Schema({ 
user: String,
ms: Number,
Date: Date
}));
