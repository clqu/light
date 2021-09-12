const Discord = require("discord.js");
let db = require("../database/models/ekledim.js");
let dBase = require("../database/models/coin.js");
let gecmis = require("../database/models/coin-geçmişi.js");
module.exports = {
  run: async (client, message, args) => {
    let lang = client.locale(client['serverData_' + message.guild.id].language)['ekledim'];
    let size = client.guilds.cache.filter(a => a.ownerID === message.author.id && a.memberCount > 100).size;
    let database = await db.findOne({ userID: message.author.id });
    if(database) return message.channel.error(lang['kullanmissin']);
    if(size === 2) {
      let coin = 25;
      await dBase.findOneAndUpdate({userID: message.author.id }, {$inc: {amount: coin }}, { upsert: true })
      await gecmis.findOneAndUpdate({ userID: message.author.id }, {$push: {gecmis: { count: coin, user: "{system}", reason: "{added}", Date: Date.now() } }}, { upsert: true});          
      await db.findOneAndUpdate({ userID: message.author.id }, {$set: {userID: message.author.id}}, { upsert: true })
      return message.channel.success(lang['kullandin'].replace("{coin}", coin));
    } else {
      return message.channel.error(lang['100ekle'].replace("{count}", size))
    }
  },
  config: {
    name: "ekledim",
    aliases: [ 'added', 'add' ],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [],
    enabled: true
  }
};