const Discord = require("discord.js");
let database = require("../database/models/coin.js");
let sdb = require("../database/models/süre.js");
let gecmis = require("../database/models/coin-geçmişi.js");

const moment = require("moment");
require('moment-duration-format')

module.exports = {
  run: async (client, message, args, premium) => {
    const lang = client.locale(client[`serverData_${message.guild.id}`].language)['coin']['günlük'];
    const globallang = client.locale(client[`serverData_${message.guild.id}`].language)['bot'];
    let ms = 86400000;
    let miktarlar;
    if(premium) {
      miktarlar = [ '6', '8', '10', '12', '14', '16' ]
    } else {
      miktarlar = [ '3', '4', '5', '6', '7', '8' ]
    }
    let alinan = miktarlar[Math.floor(Math.random() * miktarlar.length)];
    let time = "1 gün";
    let süredata = await sdb.findOne({ user: message.author.id });
    
    if (süredata) {
      let kalan = süredata.ms - (Date.now() - süredata.Date);
      if(kalan >= 1) return message.channel.error(lang['suregecmeli'].replace("{time}", '**' + moment.duration(kalan).format(`D [${globallang['days']}], H [${globallang['hour']}], m [${globallang['min']}], s [${globallang['seconds']}]`) + '**'));
    };
    
    await database.findOneAndUpdate({userID: message.author.id }, {$inc: {amount: alinan }}, { upsert: true })
    await sdb.findOneAndUpdate({user: message.author.id }, {$set: { Date: Date.now(), ms: ms }}, { upsert: true })
    await gecmis.findOneAndUpdate({userID: message.author.id}, {$push: {gecmis: { count: alinan, user: '{system}', reason: '{daily}', Date: Date.now() } }}, { upsert: true});          
    return message.channel.success(lang['alindi'].replace("{miktar}", alinan).replace("{time}", `1 ${globallang['days']}`))
  },
  config: {
    name: "günlük-ödül",
    aliases: [ 'gö', 'daily-reward', 'dr', 'daily-rewards'],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [],
    enabled: true
  }
};