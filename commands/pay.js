const Discord = require("discord.js");
let database = require("../database/models/coin.js");
let gecmis = require("../database/models/coin-geçmişi.js");
module.exports = {
  run: async (client, message, args) => { 
      let lang = client.locale(client[`serverData_${message.guild.id}`].language)['coin'];
      let user = message.mentions.users.first();
      if(!user) return message.channel.error(lang['üyebelirt'])
      if(isNaN(args[1])) return message.channel.error(lang['gönderilecek'])
      let gönderilcek = parseInt(args[1]);
      let yasaklar = ["-","+","*","/",".","%"]
      if(yasaklar.some(a => message.content.includes(a))) return message.channel.error(lang['gönderilecek']);
      if(user.id === message.author.id) return message.channel.error(lang['authorerr'])
      if(user.bot) return message.channel.error(lang['boterr'])
      let a = await database.findOne({ userID: message.author.id })
      let kullanicimoney = a.amount || 0;
      if (kullanicimoney < gönderilcek) return message.channel.error(lang['sendeyok'].replace("{gönderilcek}", gönderilcek));
      if (gönderilcek > 9999) return message.channel.error(lang['limit']);

      await database.findOneAndUpdate({userID: user.id }, {$inc: {amount: gönderilcek}}, { upsert: true })
      await database.findOneAndUpdate({userID: message.author.id }, {$inc: {amount: -gönderilcek}})
      await gecmis.findOneAndUpdate({userID: user.id }, {$push: {gecmis: { count: gönderilcek, user: message.author.tag, reason: 'Transfer', Date: Date.now() } }});
      await gecmis.findOneAndUpdate({userID: message.author.id }, {$push: {gecmis: { count: -gönderilcek, user: user.tag, reason: 'Transfer', Date: Date.now() } }});


      return message.channel.success(lang['gönderdi'].replace("{gönderilcek}", gönderilcek).replace("{user}", user))
  },
  config: {
    name: "pay",
    aliases: ["share"],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [],
    enabled: true
  }
};
