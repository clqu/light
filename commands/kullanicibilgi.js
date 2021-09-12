const Discord = require('discord.js');
const moment = require("moment");
require('moment-duration-format');
const premiumdata = require("../database/models/pre.js");

module.exports = {
    run: async (client, message, args) => {
  let lang = client.locale(client[`serverData_${message.guild.id}`].language)['kullanıcıb'];
  let globallang = client.locale(client[`serverData_${message.guild.id}`].language)['bot'];
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
  let acilis = `${moment(message.author.createdAt).format('DD')} ${tarihler[moment(message.author.createdAt).format('MM')]} ${moment(message.author.createdAt).format('YYYY h:mm:ss')}`;
  let predurum;
  let presüre;
  let predata = await premiumdata.findOne({ user: message.author.id });
  if(predata) {
    let süre = predata.ms - (Date.now() - predata.Date);
    predurum = lang['active'];
    presüre = moment.duration(süre).format(`D [${globallang['days']}], H [${globallang['hour']}], m [${globallang['min']}], s [${globallang['seconds']}]`);
  } else {
    predurum = lang['deactive'];
    presüre = lang['deactive'];
  }
  const membed = new Discord.MessageEmbed();
  membed.setColor('#F4F4F4')
  membed.setAuthor(message.author.username+`(${message.author.id})`, message.author.avatarURL({dynamic: true}))
  membed.setThumbnail(message.author.avatarURL({dynamic: true}))
  membed.addField(`:id: ${lang['kid']}`,`${message.author.id}`, true)
  membed.addField(`:card_index: ${lang['kadi']}`, message.author.username, true)
  membed.addField(`:hash: ${lang['ktag']}`, message.author.discriminator, true)
  membed.addField(`:diamond_shape_with_a_dot_inside: ${lang['premium']}`, "`"+predurum+"`", true)
  if(predata) {
  membed.addField(`:timer: ${lang['presüre']}`, presüre, true)
  membed.addField(`ᅠ`, `ᅠ`, true)
  }
  membed.addField(`:date: ${lang['kacilis']}`,acilis, true)
  membed.addField(`:robot: ${lang['kekledigi']}`, client.guilds.cache.filter(a => a.ownerID === message.author.id).size, true)
  message.channel.send(membed)
  },
    config: {
        name: 'kullanicibilgi',
        aliases: ['kullanıcıbilgi','kullanicibilgi','kb','user-info','userinfo','ui'],
        desc: 'açıklama',
        perms: [],
        enabled: true
    }
};