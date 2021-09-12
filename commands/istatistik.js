const Discord = require("discord.js");
const moment = require('moment')
require("moment-duration-format");
var os = require('os')
var config = require('../config.js');

module.exports = {
  run: async (client, message, args, db) => { 
    let owners = [];
    config.developers.forEach(id => {
      let user = client.users.cache.get(id);
      if (user) owners.push(user.tag);
    });
    
    let $now = Date.now();
    await require('../database/models/server.js').findOne({ guildID: message.guild.id });
    let dbPing = Date.now() - $now;
    
    const samita = moment.duration(client.uptime).format(" D [gn], H [sa], m [dk], s [sn]");
    let lang = client.locale(client['serverData_' + message.guild.id].language)['istatistik'];
    const botDB = require("../database/models/bot.js");
    const database = await botDB.findOne({botID: client.user.id})
    const lightpartner = new Discord.MessageEmbed()
      .setColor('#F4F4F4')
      .setThumbnail(client.user.avatarURL())
      .setTitle('<:istatistiq:841270673443389441>ᅠ'+ lang['title'])
      .addField('<a:servers:841269802739302431>ᅠ•ᅠ' + lang['generalDatas'], "```" + client.guilds.cache.size.toLocaleString() + " sunucu, " + client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + " kullanıcı, " + client.channels.cache.size.toLocaleString() + " kanal```")
      .addField('<:pong:841270306236792872>ᅠ•ᅠ' + lang['pingDatas'], "```Bot Gecikmesi: " + client.ws.ping + "ms, Mongoose Gecikmesi: " + dbPing + "ms```")
      .addField('<:kitapliq:841269655402577950>ᅠ•ᅠ' + lang['softwareDatas'], "```discord.js@" + Discord.version + " & node.js " + process.version + "```")
      .addField('<:time:841269439336153101>ᅠ•ᅠ' + lang['uptime'], "```" + samita + "```", true)
      .addField(':handshake:ᅠ•ᅠ' + lang['totalPartner'], "```" + (database ? (database.partnerCount ? database.partnerCount : 0) : 0) + "```", true)
      .addField('<:devv:841269293680295937>ᅠ•ᅠ' + lang['dev'], "```" + owners.map((user, key) => ([ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ].includes(key) ? '\n' : '') + user).join(', ') + "```")
      .setFooter(client.user.username + ' ©️ ' + new Date().getFullYear(), client.user.avatarURL())
      .setTimestamp();
  return message.channel.send(lightpartner);
  },
  config: {
    name: "istatistik",
    aliases: [ 'i' , 'statistics'],  
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [],
    enabled: true
  }
};