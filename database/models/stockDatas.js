const mongoose = require("mongoose");
module.exports = mongoose.model("stockDatas", new mongoose.Schema({ 
  guild: String,
  pazar: {type:Object, default:{}},
  pazartesi: {type:Object, default:{}},
  sali: {type:Object, default:{}},
  carsamba: {type:Object, default:{}},
  persembe: {type:Object, default:{}},
  cuma: {type:Object, default:{}},
  cumartesi: {type:Object, default:{}}
}));
