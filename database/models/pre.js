const mongoose = require("mongoose");
module.exports = mongoose.model("premiums", new mongoose.Schema({ 
user: String,
Date: Date,
ms: Number
}));
