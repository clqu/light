const Discord = require('discord.js');
const moment = require('moment');
const partnerdata = require("../database/models/server.js");
module.exports = {
    run: async (client, message, args) => {
  let lang = client.locale(client[`serverData_${message.guild.id}`].language)['sunucub'];
  let globallang = client.locale(client[`serverData_${message.guild.id}`].language)['bot'];
  let findOne = await partnerdata.findOne({ guildID: message.guild.id });
  let predurum = '';
  let presüre = '';
  if(findOne) {
  if(findOne.premium_durum == "Aktif") {
    let süre = findOne.premium_ms - (Date.now() - findOne.premium_Date);
    predurum = lang['active'];
    presüre = moment.duration(süre).format(`D [${globallang['days']}], H [${globallang['hour']}], m [${globallang['min']}], s [${globallang['seconds']}]`);
  } else {
    predurum = lang['deactive'];
    presüre = lang['deactive'];
  }
  } else {
    predurum = lang['deactive'];
    presüre = lang['deactive'];
  }
  let tarihler = {
    "01": globallang['aylar']['ocak'],
    "02": globallang['aylar']['subat'],
    "03": globallang['aylar']['mart'],
    "04": globallang['aylar']['nisan'],
    "05": globallang['aylar']['mayis'],
    "06": globallang['aylar']['haziran'],
    "07": globallang['aylar']['temmuz'],
    "08": globallang['aylar']['agustos'],
    "09": globallang['aylar']['eylül'],
    "10": globallang['aylar']['ekim'],
    "11": globallang['aylar']['kasim'],
    "12": globallang['aylar']['aralik']
  }
  const embed = new Discord.MessageEmbed()
  .setColor('#F4F4F4')
  .setTitle(`${message.guild.name} (${message.guild.id})`)
  .setThumbnail(message.guild.iconURL({ dynamic: true }));
  embed.addField(`» ${lang['swadı']}`,`${message.guild.name}`)
  embed.addField(`» ${lang['swsahib']}`, message.guild.owner ? (message.guild.owner.user ? message.guild.owner.user.tag : 'Bilinmiyor') : 'Bilinmiyor')
  embed.addField(`:diamond_shape_with_a_dot_inside: ${lang['premium']}`, "`"+predurum+"`", true)
  if(findOne) {
  if(findOne.premium_durum == "Aktif") {
    embed.addField(`:timer: ${lang['presüre']}`, presüre, true)
    embed.addField(`ᅠ`, `ᅠ`, true)
  }
  }
  embed.addField(`» ${lang['swüye']} [${message.guild.memberCount}]:  `, `:bust_in_silhouette: ${message.guild.memberCount - message.guild.members.cache.filter(a => a.user.bot).size} | :robot: ${message.guild.members.cache.filter(m => m.user.bot).size}`)
  embed.addField(`» ${lang['kanal']} [${message.guild.channels.cache.size}]`,`:sound: ${message.guild.channels.cache.filter(chan => chan.type === 'voice').size} | :speech_balloon: ${message.guild.channels.cache.filter(chan => chan.type === 'text').size}`)
  embed.addField(`» ${lang['ektahrih']}`,`${moment(message.guild.me.joinedAt).format('DD')} ${tarihler[moment(message.guild.me.joinedAt).format('MM')]} ${moment(message.guild.me.joinedAt).format('YYYY h:mm:ss')}`)
  embed.addField(`» ${lang['partner']}`, findOne ? (findOne.partner_partnerCount ? findOne.partner_partnerCount : 0) : 0)
  message.channel.send(embed)
  },
    config: {
        name: 'sunucubilgi',
        aliases: ['sunucubilgi','sunucu-bilgi','sb','server-info','serverinfo','si'],
        desc: 'açıklama',
        perms: [],
        enabled: true
    }
};