const Discord = require("discord.js");
const partnerdata = require("../database/models/server.js");
const botdata = require("../database/models/bot.js");
let database = require("../database/models/coin.js");
let gecmis = require("../database/models/coin-geçmişi.js");
let sdb = require("../database/models/url-süre.js")
const { MessageButton } = require("discord-buttons");
module.exports = {
  run: async (client, message, args, db) => {
    let lang = client.locale(client[`serverData_${message.guild.id}`].language)['partner'];
    let glang = client.locale(client[`serverData_${message.guild.id}`].language)['quest'];
    let globallang = client.locale(client[`serverData_${message.guild.id}`].language)['bot'];
    let findOne = await partnerdata.findOne({ guildID: message.guild.id });
    let coinData = await database.findOne({ userID: message.author.id });
    if (!args[0])
      return message.channel.error(lang['invalidArgs[1]']);
    /*=======[ ÖZEL URL ]=======*/
     if(args[0] == 'url'){
       if(!findOne) return message.channel.error(lang['durumDeaktif']); 
       if(findOne.partner_durum === "DeAktif") return message.channel.error(lang['durumDeaktif']); 
        const url = args[1]
        if(!url) return message.channel.error(lang['url']['urlbelirt']);
        if(url.length > 32) return message.channel.error(lang['url']['maxerr']);
        if(url.length < 3) return message.channel.error(lang['url']['minerr']);
        if(/^[a-zA-Z]+$/.test(url) !== true) return message.channel.error(lang['url']['invalid']);
        if(coinData.amount < 60) return message.channel.error(lang['url']['yetersizBakiye']);
        let urldatabasefindOne = await partnerdata.findOne({ partner_inviteURL: url });
        message.channel.areYouSure(lang['url']['quest'].replace("{url}", url));
                message.channel
                  .awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ["time"]
                  })
                  .then(async message => {
                    message = message.first();
                    if (message.content.toLowerCase() === glang['yes']) {
                      if(!findOne.premium_davetkodu) {
                        if(urldatabasefindOne) return message.channel.error(lang['url']['mevcut'].replace("{url}", url));
                        await sdb.findOneAndUpdate({guild: message.guild.id }, {$set: { Date: Date.now(), ms: 604800000 }}, { upsert: true })
                        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_inviteURL: url }}, { upsert: true })
                        await database.findOneAndUpdate({userID: message.author.id }, {$inc: {amount: -60}})
                        await gecmis.findOneAndUpdate({userID: message.author.id}, {$push: {gecmis: { count: -60, user: "Sistem", reason: "Özel URL", Date: Date.now() } }}, { upsert: true});          
                        return message.channel.success(lang['url']['aldin'].replace("{miktar}", 60).replace("{url}", url).replace("{time}", "7 gün").replace("{url}", url));
                      } else {
                        if(urldatabasefindOne) return message.channel.error(lang['url']['mevcut'].replace("{url}", url));
                        await sdb.findOneAndUpdate({guild: message.guild.id }, {$set: { Date: Date.now(), ms: 2629800000 }}, { upsert: true })
                        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_inviteURL: url, premium_davetkodu: null }}, { upsert: true })
                        return message.channel.success(lang['url']['aldin'].replace("{miktar}", 0).replace("{url}", url).replace("{time}", "30 gün").replace("{url}", url));
                      }
                      
                    } else if (message.content.toLowerCase() === glang['no']) {
                    message.channel.success(glang['commandCanceled'])
                    }

     })
     }
    
    /*=======[ ÖZEL URL   ]=======*/

    /*=======[ SORUMLU ]=======*/
    if (args[0] === lang['args']['authorizationRole']) {
      
      if (!args[1])
        return message.channel.error(lang['invalidArgs[2]']);
      if (args[1] === lang['args']['set']) {
        let rol = message.mentions.roles.first();
        if (!rol)
          return message.channel.error(lang['tagRole']);
         await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_sorumlu: rol.id }}, { upsert: true })
        message.channel.success(lang['staffRoleSaved']);
      } else if (args[1] === lang['args']['reset']) {
        if (findOne.partner_durum === "Aktif") return message.channel.error(lang['statusActiveNotChange']);
        if (!findOne.partner_sorumlu)
          return message.channel.error(lang['staffRoleError[1]']);
        message.channel.areYouSure(lang['staffRoleQuest[1]']);
        message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(async message => {
            message = message.first();
              if (message.content.toLowerCase() === glang['yes']) {
              await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_sorumlu: null }}, { upsert: true })
              return message.channel.success(lang['staffRoleReseted']);
            } else if (message.content.toLowerCase() === glang['no']) {
              return message.channel.error(glang['commandCanceled']);
            }
          })
          .catch(collected => {
            message.channel.error(glang['timeout']);
          });
      }
    }

    /*=======[ TEXT ]=======*/
    if (args[0] === "text") {
      if (!args[1])
        return message.channel.error(lang['invalidArgs[3]']);
      if (args[1] === lang['args']['set']) {
        let yazi = args.slice(2).join(" ");
        if (!yazi) return message.channel.error(lang['writeText']);
        if (yazi.length < 1 || yazi.length > 1950) return message.channel.error(lang['limited']);
        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_text: yazi }}, { upsert: true })
        message.channel.success(lang['textChanged'].replace(`{text}`, yazi));
      } else if (args[1] === lang['args']['reset']) {
        if (findOne.partner_durum === "Aktif") return message.channel.error(lang['statusActiveNotChange']);
        if (!findOne.partner_text)
          return message.channel.error(lang['textDeActive']);
        message.channel.areYouSure(lang['partnerTextQuest']);
        message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(async message => {
            message = message.first();  
            if (message.content.toLowerCase() === glang['yes']) {
              await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_text: null }}, { upsert: true })
              return message.channel.success(lang['successReset']);
            } else if (message.content.toLowerCase() === glang['no']) {
              return message.channel.error(glang['commandCanceled']);
            }
          })
          .catch(collected => {
            message.channel.error(glang['timeout']);
          });
      }
    }

    /*=======[ DURUM ]=======*/
    if (args[0] === lang['args']['status']) {
      if (!args[1])
        return message.channel.error(lang['invalidArgs[4]']);
      if (args[1] === lang['args']['open']) {
        if(!findOne) return message.channel.error(lang['textWrite']); 
          let sorumlu = findOne.partner_sorumlu
          let text = findOne.partner_text
          let kanal = findOne.partner_kanal
          let log = findOne.partner_log
        if(!text || !kanal || !log || !sorumlu) return message.channel.error(lang['textWrite']); 
        if (findOne.partner_durum === "Aktif") return message.channel.error(lang['statusAlreadyActive']);
        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_inviteURL: idCreate(5), partner_durum: "Aktif" }}, { upsert: true })
        return message.channel.success(lang['statusActive']);
      } else if (args[1] === lang['args']['close']) {
        if (findOne.partner_durum === "DeAktif")
          return message.channel.error(lang['statusAlreadyDeActive']);
        message.channel.areYouSure(lang['statusQuest']);
        message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(async message => {
            message = message.first();
            if (message.content.toLowerCase() === glang['yes']) {
              await sdb.updateOne({ guild: message.guild.id }, {$set: { ms: 999999 }}, { upsert: true });
              await sdb.deleteOne({ guild: message.guild.id });
              await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_durum: "DeAktif", partner_inviteURL: null }}, { upsert: true });
              return message.channel.success(lang['partnerReseted']);
            } else if (message.content.toLowerCase() === glang['no'] || message.content.toLowerCase() != glang['yes'] && message.content.toLowerCase() != glang['no']) {
              return message.channel.error(glang['commandCanceled']);
            }
          })
          .catch(collected => {
            message.channel.error(glang['timeout']);
          });
      }
    }
    /*=======[ KANALLAR ]=======*/
    if (args[0] === lang['args']['channel']) {
      if (!args[1])
        return message.channel.error(lang['invalidArgs[5]']);
      if (args[1] === "partner") {
        let kanal = message.mentions.channels.first();
        if (!kanal)
          return message.channel.error(lang['notTaggedChannel']);
        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_kanal: kanal.id }}, { upsert: true })
        message.channel.success(lang['channelChanged[1]'].replace("{kanal}", kanal.id));
      } else if (args[1] === "log") {
        let kanal = message.mentions.channels.first();
        if (!kanal)
          return message.channel.error(lang['notTaggedChannel']);
        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_log: kanal.id }}, { upsert: true })
        message.channel.success(lang['channelChanged[2]'].replace("{kanal}", kanal.id));
      }
    }

    /*=======[ SIFIRLA ]=======*/
    if (args[0] === lang['args']['reset']) {
      if (findOne.partner_durum === "Aktif") return message.channel.error(lang['statusActiveNotChange']);
      message.channel.areYouSure(lang['resetAll?']);
      message.channel
        .awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 30000,
          errors: ["time"]
        })
        .then(async message => {
          message = message.first();
          if (message.content.toLowerCase() === glang['yes']) {
        await sdb.updateOne({ guild: message.guild.id }, {$set: { ms: 999999 }}, { upsert: true });
        await sdb.deleteOne({ guild: message.guild.id });
        await partnerdata.updateOne({ guildID: message.guild.id }, {$set: {
          partner_durum: "DeAktif",
          partner_sorumlu: null,
          partner_text: null,
          partner_kanal: null,
          partner_log: null,
          partner_inviteURL: null
        }}, { upsert: true })
            return message.channel.success(lang['datasDeleted']);
          } else if (message.content.toLowerCase() === glang['no']) {
            return message.channel.error(glang['comamndCanceled']);
          }
        })
        .catch(collected => {
          message.channel.error(glang['timeout']);
        });
    }

    /*=======[ BILGI ]=======*/
    if (args[0] === lang['args']['info']) {
      const embed = new Discord.MessageEmbed().setColor("#F4F4F4");
      let sorumlu = findOne ? (findOne.partner_sorumlu ? "<@&" + findOne.partner_sorumlu + ">" : lang['info']['notFound']) : lang['info']['notFound'];
      let durum = "";
      if(findOne) {
      if(findOne.partner_durum === "DeAktif") durum = lang['info']['deactive'];
      if(findOne.partner_durum === "Aktif") durum = lang['info']['active'];
      } else {
        durum = lang['info']['deactive']
      }
      let log = findOne ? (findOne.partner_log ? "<#" + findOne.partner_log + ">" : lang['info']['notFound']) : lang['info']['notFound'];
      let kanal = findOne ? (findOne.partner_kanal ? "<#" + findOne.partner_kanal + ">" : lang['info']['notFound']) : lang['info']['notFound'];
      let text = findOne ? (findOne.partner_text ? "```" + findOne.partner_text + "```" : lang['info']['notFound']) : lang['info']['notFound'];
      let url = findOne ? (findOne.partner_durum == "Aktif" ? findOne.partner_inviteURL : lang['info']['deactive']) : lang['info']['deactive'];;
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
     
      embed.setDescription(`
      • :tools: **${lang['info']['staff']}** » ${sorumlu}
      • :recycle: **${lang['info']['status']}** » \`${durum}\`
      • :hash: **${lang['info']['channel']}** » ${kanal}
      • :hash: **${lang['info']['log']}** » ${log}
      • :link: **${lang['info']['url']}** » \`${url}\`
      • :timer: **${lang['info']['urlSüre']}** » \`${süre || '∞'}\`
      • :pencil: **${lang['info']['text']}** » [Yazının tam hali için tıkla!](https://lightbot.me/dashboard/${message.guild.id}/partner)
      \`\`\`${text.split('```').join('').slice(0, 497) + '...'}\`\`\`
      `);
      embed.setAuthor(message.guild.name);
      message.channel.send(embed);
    }
    /*=======[ ŞART ]=======*/
    if(args[0] === lang['args']['partnerLimit']) {
      if(!args[1]) return message.channel.error(lang['invalidArgs[7]']);
      if(args[1] === lang['args']['open']) {
        let sart = args[2];
        if(isNaN(sart)) return message.channel.error(lang['gecersizSart']);
        if(sart > message.guild.memberCount) return message.channel.error(lang['fazlaRakam']);
        await partnerdata.findOneAndUpdate({guildID: findOne.guildID }, {$set: { partner_sart: sart }}, { upsert: true })
        message.channel.success(lang['sartAyarlandi'].replace("{limit}", sart))
      } else if(args[1] === lang['args']['close']) {
        if(!findOne) return message.channel.error(lang['sartKapali']);
        if(!findOne.partner_sart) return message.channel.error(lang['sartKapali']);
        message.channel.areYouSure(lang['sartSoru']);
        message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(async message => {
            message = message.first();
            if (message.content.toLowerCase() === glang['yes']) {
              await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { partner_sart: null }}, { upsert: true });
              return message.channel.success(lang['sartKapandi']);
            } else if (message.content.toLowerCase() === glang['no'] || message.content.toLowerCase() != glang['yes'] && message.content.toLowerCase() != glang['no']) {
              return message.channel.error(glang['commandCanceled']);
            }
          })
          .catch(collected => {
            message.channel.error(glang['timeout']);
          });
      }
    }
    /*=======[ OL ]=======*/
    if(args[0] === lang['args']['postPartner']) {
       if(!findOne) return message.channel.error(lang['durumDeaktif']); 
       if(findOne.partner_durum === "DeAktif") return message.channel.error(lang['durumDeaktif']); 
       if(!findOne.partner_inviteURL) return message.channel.error(lang['durumDeaktif']); 
        let kod = args[1]
        if(!kod) return message.channel.error(lang['invalidArgs[6]'].replace("{prefix}", client.prefix));
        let partnerbul = await partnerdata.findOne({ partner_inviteURL: kod })
        if(!partnerbul) return message.channel.error(lang['partnerurlyanlis']);
        if(message.guild.id === partnerbul.guildID) return message.channel.error(lang['thisYourServer']);
        if(message.guild.memberCount < partnerbul.partner_sart) return message.channel.error(lang['yetersizLimit'].replace("{limit}", partnerbul.partner_sart));
        client.users.fetch(message.guild.ownerID).then(async a => {
          const moment = require('moment');
          moment.locale('TR');
          let tarih = moment(message.guild.createdAt).format('LLL')
        let postPartner = require("../database/models/partner-ol.js")
        let postedPartner = await postPartner.findOne({ karsiSunucu: partnerbul.guildID, guildID: message.guild.id })
        if(postedPartner) return message.channel.error(lang['partnerGonderilmis']);
        const kabul = new MessageButton()
        .setStyle('green')
        .setLabel('Onayla')
        .setID('kabul');
        const red = new MessageButton()
        .setStyle('red')
        .setLabel('Reddet')
        .setID('red');
        const partneredEmbed = new Discord.MessageEmbed()
        .setColor("#F4F4F4")
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setDescription(lang['partnerMesaj']
                        .replace("{sunucuAdi}", message.guild.name)
                        .replace("{memberCount}", message.guild.memberCount)
                        .replace("{sahip}", a.tag)
                        .replace("{yetkili}", message.author.tag)
                        .replace("{opendate}", tarih)
                        .replace("{partnerCount}", findOne.partner_partnerCount || "0")
                        .replace("{inviteCode}", findOne.partner_inviteURL)
                        .replace("{inviteCode}", findOne.partner_inviteURL)  
                        .replace("{inviteCode}", findOne.partner_inviteURL)
                       );
        client.channels.cache.get(partnerbul.partner_log).send(`<@&${partnerbul.partner_sorumlu}>`, { embed: partneredEmbed, buttons: [ kabul, red] }).then(async msg => {
          await postPartner.updateOne({ guildID: message.guild.id }, {$set: { message: msg.id, karsiSunucu: partnerbul.guildID, guildID: message.guild.id, author: message.author.id }}, { upsert: true })
          message.channel.success(lang['partnerGönderildi'])
        }) 
        }) 
    }
  },
  config: {
    name: "partner",
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