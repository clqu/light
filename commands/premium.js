const Discord = require('discord.js');
const moment = require('moment');
const premiumdata = require("../database/models/pre.js");
const preserver = require("../database/models/pre-activation.js");
const partnerdata = require("../database/models/server.js");
const coin = require("../database/models/coin.js");
let gecmis = require("../database/models/coin-geçmişi.js");
const config = require("../config.js")
module.exports = {
    run: async (client, message, args) => {
      if(!args[0]) return message.channel.error("Bir argüman girmelisin.\nArgümanlar; `sunucu`, `kullanıcı`");
      let ay = 2629800000;
      
      
      if(args[0] === "kullanıcı") {
        if (!config.developers.includes(message.author.id)) return;
        if(args[1] === "ekle") {
        let user = args[2];
        if(!user) return message.channel.error("Bir kullanıcı id'si girmelisin.");
        client.users.fetch(user).then(async u => {
          if(u.bot) return message.channel.error("Bir bota premium veremezsin.");
          await premiumdata.updateOne({ user: u.id }, {$set: {Date: Date.now(), ms: ay}}, { upsert: true })
          let guild = client.guilds.cache.get("773128369138958366").members.cache.get(u.id);
          if(guild) {
           client.guilds.cache.get("773128369138958366").members.cache.get(u.id).roles.add("845445341994418226")
          }
          await coin.findOneAndUpdate({userID: u.id }, {$inc: {amount: 150 }}, { upsert: true })
          await gecmis.findOneAndUpdate({userID: u.id}, {$push: {gecmis: { count: 150, user: '{system}', reason: 'Premium', Date: Date.now() } }}, { upsert: true});          
          message.channel.embed(`Premium başarıyla aktifleştirildi.\n\n**Kullanıcı**: ${u.tag}\n**Süresi**: 1 Ay\n**Yetkili**: ${message.author.tag}`, { color: "GREEN", author: ["✅ Mükemmel!", client.user.avatarURL() ], footer: [ u.tag, u.avatarURL({dynamic: true})]})
        })
      } else if(args[1] === "sil") {
        let user = args[2];
        if(!user) return message.channel.error("Bir kullanıcı id'si girmelisin.");
        client.users.fetch(user).then(async u => {
          if(u.bot) return message.channel.error("Bir botdan premium alamazsın.");
          let pdata = await premiumdata.findOne({ user: u.id });
          if(!pdata) return message.channel.error("Bu kullanıcıda premium bulunmuyor.");
          await premiumdata.deleteOne({ user: u.id })
          message.channel.embed(`Premium başarıyla silindi.\n\n**Kullanıcı**: ${u.tag}\n**Yetkili**: ${message.author.tag}`, { color: "GREEN", author: ["✅ Mükemmel!", client.user.avatarURL() ], footer: [ u.tag, u.avatarURL({dynamic: true})]})
        })
      }
    }
      
    if(args[0] === "sunucu") {
      if (!config.developers.includes(message.author.id)) return;
      if(args[1] === "kod") {
      if(args[2] === "oluştur") {
        let activation = 'LP-' + idCreate(7) + '-' + idCreate(7) + '-' + idCreate(7);
        message.channel.success(`Kod başarıyla oluşturuldu.\nAktivasyon Kodu; \`${activation}\``);
        
        const moment = require('moment');
        require('moment-duration-format');
        
        await preserver.updateOne({ kod: activation }, {$set: {
          creator: message.author.tag,
          date: moment(Date.now()).format('HH:mm DD.MM.YYYY')
        }}, { upsert: true });
      } else if(args[2] === "liste") {
        let database = await preserver.find();
        let texts = '';
        let creators = '';
        let dates = '';
        if(database.length <= 0) return message.channel.error("Sistemde premium aktivasyon kodu bulunamadı.");
        await database.map(a => {
          texts += ' > ``' + a.kod + '``\n ';
          creators += ' > ``' + a.creator + '``\n ';
          dates += ' > ``' + a.date + '``\n ';
        })
        
        message.channel.send(
          new Discord.MessageEmbed().setTitle("Sunucu Premium Aktivasyon Kodları")
            .setColor("#F4F4F4")
            .addField('Aktivasyon Kodu', texts, true)
            .addField('Yetkili', creators, true)
            .addField('Oluşturulma Tarihi', dates, true)
        );
      } else if(args[2] === "sil") {
      let kodd = args[3];
      if(!kodd) return message.channel.error("Bir kod girmelisin.");
      let a = await preserver.findOne({ kod: kodd });
      if(!a) return message.channel.error("Geçersiz bir kod girdiniz.");
      message.channel.areYouSure(`**${a.kod}** kodunu silmek istediğinizden emin misiniz? \`(evet/hayır)\`\n> Oluşturma Tarihi: ${a.date}\n> Yetkili: ${a.creator}`)
              message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(async message => {
            message = message.first();
              if (message.content.toLowerCase() === "evet") {
              await preserver.deleteOne({ kod: kodd });
              return message.channel.success("Kod başarıyla silindi.");
            } else if (message.content.toLowerCase() === "hayır") {
              return message.channel.error("Kod silme işlemi iptal edildi.");
            }
          })
          .catch(collected => {
            message.channel.error("İşlem zaman aşımına uğradı.");
          });
    }    
      }
    }
      
    if(args[0] === "kullan") {
      let lang = client.locale(client[`serverData_${message.guild.id}`].language)['premium'];
      let kodd = args[1];
        if(!kodd) return message.channel.error(lang['writeCode']);
      let a = await preserver.findOne({ kod: kodd });
        if(!a) return message.channel.error(lang['invalidCode']);
      client.users.fetch(message.guild.ownerID).then(async u => {
      message.channel.success(lang['premiumActive']
                              .replace("{serverName}", message.guild.name)
                              .replace("{serverID}", message.guild.id)
                              .replace("{ownerName}", u.tag)
                             );
          await partnerdata.updateOne({ guildID: message.guild.id }, {$set: { premium_davetkodu: "Aktif", premium_durum: "Aktif", premium_Date: Date.now(), premium_ms: ay }}, { upsert: true })
          await premiumdata.updateOne({ user: u.id }, {$set: {Date: Date.now(), ms: ay}}, { upsert: true })
          let guild = client.guilds.cache.get("773128369138958366").members.cache.get(u.id);
          if(guild) {
           client.guilds.cache.get("773128369138958366").members.cache.get(u.id).roles.add("845445341994418226")
          }
           await preserver.deleteOne({ kod: kodd });
          await coin.findOneAndUpdate({userID: u.id }, {$inc: {amount: 150 }}, { upsert: true })
          await gecmis.findOneAndUpdate({userID: u.id}, {$push: {gecmis: { count: 150, user: '{system}', reason: 'Premium', Date: Date.now() } }}, { upsert: true});  
      })
      
      
    }  
    
      
      
    },
    config: {
        name: 'premium',
        aliases: [],
        desc: '',
        perms: [],
        enabled: true
    }
};

function idCreate(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789?/#%';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
} 