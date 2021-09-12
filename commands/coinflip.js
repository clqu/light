const Discord = require("discord.js");
let database = require("../database/models/coin.js");
let sdb = require("../database/models/süre.js");
let gecmis = require("../database/models/coin-geçmişi.js");

module.exports = {
  run: async (client, message, args, premium) => {
    let lang = client.locale(client['serverData_' + message.guild.id].language)['coinflip'];
    
    let bet = args[0];
    let random = Math.floor(Math.random() * 3);
    let user = await database.findOne({ userID: message.author.id });
    
    if (!bet) return message.channel.error(lang['args[0]']);
    if (isNaN(bet)) return message.channel.error(lang['args[1]']);
    if (bet.toString().includes('.')) return message.channel.error(lang['args[2]']);
    if (parseInt(bet) < 3 || parseInt(bet) > 50) return message.channel.error(lang['args[3]']);
    if (!user || user.amount < parseInt(bet)) return message.channel.error(lang['args[4]'].replace("{coin}", bet));
    
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor('#F4F4F4')
        .setDescription(lang['flipping'])
    ).then(msg => {
      setTimeout(async () => {
        if (random == 1) {
          if(premium) {
          msg.edit(
            new Discord.MessageEmbed()
              .setColor('#F4F4F4')
              .setDescription(lang['nothing'])
          );
          } else {
          await database.findOneAndUpdate({userID: message.author.id }, {$inc: {amount: -bet }}, { upsert: true })
          await gecmis.findOneAndUpdate({userID: message.author.id}, {$push: {gecmis: { count: -bet, user: "{system}", reason: "{coinflip}", Date: Date.now() } }}, { upsert: true});          
          msg.edit(
            new Discord.MessageEmbed()
              .setColor('#F4F4F4')
              .setDescription(lang['youLost'].replace("{coin}", bet))
          );
          }
        };
        
        if (random == 0) {
          msg.edit(
            new Discord.MessageEmbed()
              .setColor('#F4F4F4')
              .setDescription(lang['nothing'])
          );
        };
        
        if (random == 2) {
          await database.findOneAndUpdate({userID: message.author.id }, {$inc: {amount: bet }}, { upsert: true })
          await gecmis.findOneAndUpdate({userID: message.author.id}, {$push: {gecmis: { count: (bet*2), user: "{system}", reason: "{coinflip}", Date: Date.now() } }}, { upsert: true});          
          msg.edit(
            new Discord.MessageEmbed()
              .setColor('#F4F4F4')
              .setDescription(lang['youWon'].replace("{coin}", (bet *2) ))
          );
        };
      }, 3000);
    });
  },
  config: {
    name: "coinflip",
    aliases: [ 'cf', 'yazı-tura', 'yt', 'yazıtura' ],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [],
    enabled: true
  }
};