const Discord = require("discord.js");
const databaseServer = require("../database/models/server.js");
const botdb = require("../database/models/bot.js");
const coindb = require("../database/models/coin.js");
const hdb = require("../database/models/coin-geçmişi.js");
const sdb = require("../database/models/url-süre.js")
const { MessageButton } = require("discord-buttons");
module.exports = {
  run: async (client, message, args, db) => {
let lang = client.locale(client[`serverData_${message.guild.id}`].language)['partner'];
let globallang = client.locale(client[`serverData_${message.guild.id}`].language)['bot'];
let findOne = await databaseServer.findOne({ guildID: message.guild.id });
let prefix = findOne ? (findOne.prefix || require("../config.js").prefix) : require("../config.js").prefix;

if(findOne) {
  let sorumlu = findOne.partner_sorumlu
  let text = findOne.partner_text
  let kanal = findOne.partner_kanal
  let log = findOne.partner_log

  if(text || kanal || log || sorumlu) return message.channel.error(lang['kurulumYapilmiski']); 
}

message.channel.send(`${lang['taggRole']}`).then(msg => {
    message.channel.awaitMessages(m => m.author.id == message.author.id, {
        max: 1,
        time: 30000
    }).then(partnerRole => {

      let role = partnerRole.first().mentions.roles.first();

        if (partnerRole.first().content) {
          if(role) {
            partnerRole.first().delete({
                timeout: 500
            })
          } else {
            partnerRole.first().delete({
                timeout: 500
            })
            return msg.edit(`${lang['gecersizArgüman']}`);
          }
        }
         msg.edit(`${lang['writePartnerText']}`)

          message.channel.awaitMessages(m => m.author.id == message.author.id, {
              max: 1,
              time: 30000
          }).then(partnerText => {
              if (partnerText.first().content) {
                  partnerText.first().delete({
                      timeout: 500
                  })
              }

         msg.edit(`${lang['tagPartnerChannel']}`)
          message.channel.awaitMessages(m => m.author.id == message.author.id, {
              max: 1,
              time: 30000
          }).then(partnerChannel => {
         let partnerChannelTag = partnerChannel.first().mentions.channels.first()

              if (partnerChannel.first().content) {
                if(partnerChannelTag) {
                  partnerChannel.first().delete({
                      timeout: 500
                  })
                } else {
                  partnerChannel.first().delete({
                      timeout: 500
                  })
                  return msg.edit(`${lang['gecersizArgüman']}`);
                }
              }
         msg.edit(`${lang['tagLogChannel']}`)
          message.channel.awaitMessages(m => m.author.id == message.author.id, {
              max: 1,
              time: 30000
          }).then(partnerLogChannel => {
         let partnerLogChannelTag = partnerLogChannel.first().mentions.channels.first()

              if (partnerLogChannel.first().content) {
                if(partnerLogChannelTag) {
                  partnerLogChannel.first().delete({
                      timeout: 500
                  })
                } else {
                  partnerLogChannel.first().delete({
                      timeout: 500
                  })
                  return msg.edit(`${lang['gecersizArgüman']}`);
                }
              }
         msg.edit(`${lang['durumuAccanmi']}`)
          message.channel.awaitMessages(m => m.author.id == message.author.id, {
              max: 1,
              time: 30000
          }).then(async partnerDurum => {

              if (partnerDurum.first().content) {
                if(partnerDurum.first().content === lang['durumEvet'] || partnerDurum.first().content === lang['durumHayır']) {
                  partnerDurum.first().delete({
                      timeout: 500
                  })
                } else {
                  partnerDurum.first().delete({
                      timeout: 500
                  })
                  return msg.edit(`${lang['gecersizArgüman']}`);
                }
              }
      let url = idCreate(5);
        await databaseServer.updateOne({ guildID: message.guild.id }, {$set: {
          partner_durum: partnerDurum.first().content == lang['durumEvet'] ? "Aktif" : "DeAktif",
          partner_sorumlu: role.id,
          partner_text: partnerText.first().content,
          partner_kanal: partnerLogChannelTag.id,
          partner_log: partnerLogChannelTag.id,
          partner_inviteURL: url
        }}, { upsert: true })

      let timeData = require("../database/models/url-süre.js");
      let timed = await timeData.findOne({ guild: message.guild.id })
      const moment = require("moment");
      require('moment-duration-format')
      let timeexp = '';
      let time = '';
      let süre = '';
      if(timed) {
      timeexp = timed.ms - (Date.now() - timed.Date);
      time = moment.duration(timeexp).format(`D [${globallang['days']}], H [${globallang['hour']}], m [${globallang['min']}], s [${globallang['seconds']}]`);
      if(time.includes('-')) {
        süre = lang['aMinute']
      } else {
        süre = time;
      }
      } else {
        if(findOne) {
          if(findOne.partner_durum == "DeAktif") { 
            time = lang['info']['deactive'];
          } else {
            time = globallang['unlimited'];
          }
        }
      }
        const kurulumTamamlandi = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setColor("GREEN")
        .setDescription(`${lang['sonradanDuzenle'].replace(`{p}`, prefix)}`)
        .addField(`• :tools: **${lang['info']['staff']}** »`, `${partnerRole.first()}`, true)
        .addField(`• :recycle: **${lang['info']['status']}** »`, `\`${partnerDurum.first().content == lang['durumEvet'] ? lang['info']['active']: lang['info']['deactive']}\``, true)
        .addField(`ᅠ`, `ᅠ`, true)
        .addField(`• :hash: **${lang['info']['channel']}** »`, `${partnerChannel.first()}`, true)
        .addField(`• :hash: **${lang['info']['log']}** »`, `${partnerLogChannel.first()}`, true)
        .addField(`ᅠ`, `ᅠ`, true)
        .addField(`• :link: **${lang['info']['url']}** »`, `\`${url}\``, true)
        .addField(`• :timer: **${lang['info']['urlSüre']}** »`, `\`${süre || "∞"}\``, true)
        .addField(`ᅠ`, `ᅠ`, true)
        .addField(`• :pencil: **${lang['info']['text']}** »`, `[${lang['textFull']}](https://lightbot.me/dashboard/${message.guild.id}/partner)\n\`\`\`${partnerText.first().content.split('```').join('').slice(0, 497) + '...'}\`\`\``, true)
         msg.edit(`${lang['kurulumTamamlandi'].replace(`{author}`, message.author)}`, kurulumTamamlandi)
          
                    })
                })
            })
        })
    })
})
  },
  config: {
    name: "kurulum",
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    aliases: [],
    perms: ["MANAGE_GUILD"],
    enabled: true
  }
};
  function idCreate(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }