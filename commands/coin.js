const Discord = require("discord.js");
let database = require("../database/models/coin.js");
let gecmis = require("../database/models/coin-geçmişi.js");

module.exports = {
  run: async (client, message, args) => { 
      let lang = client.locale(client[`serverData_${message.guild.id}`].language)['coin'];
      if(args[0] === "işlem"){            
        let user = message.mentions.users.first() || client.users.cache.get(args[1]);
        if(!user) return message.channel.error(lang['üyebelirt'])
        let moneyCount = args[2];
        if(!moneyCount) return message.channel.error(lang['gönderilecek'])
        if (isNaN(moneyCount)) return message.channel.error(lang['gecersizMiktar']);
        if (moneyCount > 9999 || moneyCount < -9999) return message.channel.error(lang['limit']);
        if(user.bot) return message.channel.error(lang['boterr'])
        await database.findOneAndUpdate({userID: user.id }, {$inc: {amount: args[2] }}, { upsert: true })
        await gecmis.findOneAndUpdate({userID: user.id}, {$push: {gecmis: { count: moneyCount, user: message.author.tag, reason: (args.slice(3).join(' ').length > 0 ? args.slice(3).join(' ').slice(0, 25) : '{none}'), Date: Date.now() } }}, { upsert: true});          
        return message.channel.success(lang['gönderdi'].replace("{gönderilcek}", moneyCount).replace("{user}", user))
      }
        if(args[0] === "geçmiş-sıfırla") {
          let user = message.mentions.users.first();
          if(!user) return message.channel.error("Bir kullanıcı belirtmelisin");
          await gecmis.deleteOne({userID: user.id})
          message.channel.success(`${user.tag} kullanıcısının hesabı sıfırlandı.`);
        }
        if(args[0] === "sıfırla") {
          let user = message.mentions.users.first();
          if(!user) return message.channel.error(lang['üyebelirt']);
          await database.findOneAndUpdate({userID: user.id }, {$set: {amount: 0 }}, { upsert: true })
          
          message.channel.success(`${user.tag} kullanıcısının hesabı sıfırlandı.`);
        }
  },
  config: {
    name: "coin",
    aliases: [],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description"   }',
    perms: [ 'DEVELOPER' ],
    enabled: true
  }
};
        