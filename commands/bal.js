const Discord = require("discord.js");
let database = require("../database/models/coin.js");
let sdb = require("../database/models/süre.js");
let gecmis = require("../database/models/coin-geçmişi.js");

module.exports = {
  run: async (client, message, args) => {
    const d = await database.findOne({ userID: message.author.id }) || 0;    
    let lang = client.locale(client[`serverData_${message.guild.id}`].language)['bal'];
    const embed = new Discord.MessageEmbed();
    embed.setColor("#F4F4F4")
    embed.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    embed.setThumbnail(client.user.avatarURL())
    let amount = d.amount || 0; 
    embed.setDescription(lang['bulunuyor'].replace("{amount}", amount.toLocaleString()))
    
    let g = await gecmis.findOne({ userID: message.author.id });
    if(!g) {  
    embed.addField(lang['geçmiş'], lang['geçmişyok'])      
    } else {    
    embed.addField(lang['geçmiş'], g.gecmis.sort((a,b) => b.Date - a.Date).slice(0, 10).map(data => {
      let text = lang['+'];
      if (parseInt(data.count) < 1) text = lang['-'];
      return text.replace('{coin}', parseInt(data.count) > 0 ? ('+' + data.count) : data.count).replace('{user}', data.user == '{system}' ? lang['system'] : data.user).replace('{reason}', data.reason == '{none}' ? lang['none'] : data.reason == '{daily}' ? lang['daily'] : data.reason == '{promocode}' ? lang['promocode'] : data.reason == '{coinflip}' ? lang['coinflip'] : data.reason == '{added}' ? lang['added'] : data.reason);
    }).join("\n"))
    }
    message.channel.send(embed)
  },
  config: {
    name: "bal",
    aliases: [ 'balance', 'hesap', 'account' ],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [],
    enabled: true
  }
};