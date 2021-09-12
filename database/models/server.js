const mongoose = require("mongoose");
module.exports = mongoose.model("server", new mongoose.Schema({ 
  guildID: String,
  prefix: { type: String, default: "!" },
  language: { type: String, default: "tr-TR" },
  
  partner_inviteURL: { type: String, default: null},
  partner_sorumlu: { type: String, default: null },
  partner_text: { type: String, default: null },
  partner_durum: { type: String, default: "DeAktif" },
  partner_kanal: { type: String, default: null },
  partner_log: { type: String, default: null },
  partner_sart: { type: String, default: null},
  partner_partnerCount: { type: Number, default: 0 },
  partner_lastPartnerDate: Date,
  
  premium_davetkodu: { type: String, default: null },
  premium_durum: { type: String, default: null },
  premium_Date: Date,
  premium_ms: Number,

}));