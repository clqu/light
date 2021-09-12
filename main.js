/*=======================================================================================*/

const Discord = require('discord.js');
const config = require('./config.js');
const client = new Discord.Client();
const moment = require('moment');
const express = require('express');
const router = express();
const fs = require('fs');
require('./reply.js')
require('dotenv').config();

/*=======================================================================================*/

/**
 * Client'i siteye tanımlar.
 */
client.on('ready', () => {
  if (!global.client) {
    global.client = client;
  };
});

/*=======================================================================================*/

/**
 * Dil'e göre mesajları yükleme fonksiyonu.
 */
client.locale = lang => {
  try {
    return require('./lang/' + lang + '.json');
  } catch {
    return require('./lang/tr-TR.json');
  }
};

/*=======================================================================================*/

/**
 * @params {Array} names
 */
function loadUtils(names) {
    names.forEach(name => {
        require('./util/' + name + '.js')(Discord, client, config);
    });
};

/*=======================================================================================*/

/**
 * Sistem dosyalarını yükler.
 */
loadUtils([
  "permissions",
  "shortcut",
  "commands",
  "events"
]);

/*=======================================================================================*/

/**
 * Komut yenileme sistemi.
 */
client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.config.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.config.name);
            });
            resolve('"' + command + '" komutu başarıyla yüklendi!');
        } catch (e) {
            reject(e.toString().includes('Cannot find module') ? 'Geçersiz komut adı yazdınız!': e);
        }
    });
};

/*=======================================================================================*/

/**
 * Database bağlanır.
 */
require('./database/connect.js')(
  client
);

/*=======================================================================================*/

client.login(config.token).then(() => {
  console.log('(!) Token doğrulandı, giriş yapılıyor...');
}).catch(() => {
  console.error('(!) Token hatalı, kontrol ediniz...');
});

/*=======================================================================================*/
/**
 * Günlük ödülün süresi bitince kullanıcıya ait süreyi sıfırlar.
 */
const süreler = require('./database/models/süre.js')
  client.on('ready', async () => {
    setInterval(async () => {
      let datalar = await süreler.find()
      if(datalar.length <= 0) return
      datalar.forEach(async a => {
        let süre = a.ms - (Date.now() - a.Date)
        if(süre > 0) return
        await süreler.findOneAndDelete({ user: a.user })
      })
    }, 1500000)
  })

/*=======================================================================================*/
/**
 * 7 günlük özel davet kodu sistemidir.
 */
const sürelerr = require('./database/models/url-süre.js')
const serverData = require('./database/models/server.js')
  client.on('ready', async () => {
    setInterval(async () => {
      let datalar = await sürelerr.find()
      if(datalar.length <= 0) return
      datalar.forEach(async a => {
        let süre = a.ms - (Date.now() - a.Date)
        if(süre > 0) return
        await serverData.updateOne({ guildID: a.guild }, {$set: { partner_inviteURL: idCreate(5) }}, {upsert: true});
        await sürelerr.findOneAndDelete({ guild: a.guild })
      })
    }, 60000)
    function idCreate(length) {
       var result           = '';
       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
  })

/*=======================================================================================*/
/**
 * 30 günlük premium(sunucu) sistemidir.
 */
const timess = require('./database/models/server.js')
  client.on('ready', async () => {
    setInterval(async () => {
      let datalar = await timess.find({ premium_durum: "Aktif" })
      if(datalar.length <= 0) return
      datalar.forEach(async a => {
        let süre = a.premium_ms - (Date.now() - a.premium_Date)
        if(süre > 0) return
        await timess.updateOne({ guildID: a.guild }, {$set: { premium_durum: null, premium_davetkodu: null }}, {upsert: true});
      })
    }, 1500000)
  })


/*=======================================================================================*/
/**
 * 30 günlük premium(kullanıcı) sistemidir.
 */
const times = require('./database/models/pre.js')
  client.on('ready', async () => {
    setInterval(async () => {
      let datalar = await times.find()
      if(datalar.length <= 0) return
      datalar.forEach(async a => {
        let süre = a.ms - (Date.now() - a.Date)
        if(süre > 0) return
        await times.findOneAndDelete({ user: a.user })
      })
    }, 1500000)
  })


/*=======================================================================================*/

/**
 * Server Join/Leave Datas
 */
const webhook = new Discord.WebhookClient("841769902322614293","oPugzkSD3Gb2BYFmXJ84quBZpkDKvBIRiuLFRknOAGc8wTmu_rP0oA0xfjWP4ajMCEQ4");

client.on('guildDelete', async guild => {
  const dbmodel = require("./database/models/server.js");
  let found = await dbmodel.findOne({guildID: guild.id});
  if(found) {
  await dbmodel.updateOne({ guildID: message.guild.id}, {$set: { partner_durum: "DeAktif", partner_inviteURL: null } });
  }
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Olamaz, bir sunucdan atıldım.")
  embed.setAuthor(guild.name, guild.iconURL({dynamic: true}))
  embed.setThumbnail(client.user.avatarURL())
  embed.addField("Sunucu Adı", guild.name)
  embed.addField("Sunucunun Kullanıcı Sayısı", guild.memberCount)
  embed.setColor("RED")
  webhook.send(embed)
})

client.on('guildCreate', async guild => {
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Heyyo, bir sunucuya eklendim.")
  embed.setAuthor(guild.name, guild.iconURL({dynamic: true}))
  embed.setThumbnail(client.user.avatarURL())
  embed.addField("Sunucu Adı", guild.name)
  embed.addField("Sunucunun Kullanıcı Sayısı", guild.memberCount)
  embed.setColor("GREEN")
  webhook.send(embed)
})

var days = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
client.on('guildMemberAdd', async member => {
  let model = require("./database/models/stockDatas.js");
  let gün = days[new Date().getDay()].toLowerCase(); 
  await model.findOneAndUpdate({
    guild: member.guild.id
  }, {
    $inc: { 
     [`${gün}.+`]: 1
    }
  }, { upsert: true });
});

client.on('guildMemberRemove', async member => {
  let model = require("./database/models/stockDatas.js");
  let gün = days[new Date().getDay()].toLowerCase(); 
  await model.findOneAndUpdate({
    guild: member.guild.id
  }, {
    $inc: { 
     [`${gün}.-`]: 1
    }
  }, { upsert: true });
})

const { CronJob } = require('cron')
const database = require('./database/models/stockDatas.js');
client.on('ready', async () => {
var resetStats = new CronJob('00 00 00 * * 1', async function() { 
let x = await database.find()
await x.forEach(async a => {
  await database.deleteOne({ guild: a.guild });
})
}, null, true, 'Europe/Istanbul');
resetStats.start();
})

/*=======================================================================================*/


/*=======================================================================================*/

/**
 * Partner Post System
 */
 const ppdata = require("./database/models/partner-ol.js");
 const pdata = require("./database/models/server.js");
 const botdatabase = require("./database/models/bot.js");
 let cData = require("./database/models/coin.js");
 let cGecmis = require("./database/models/coin-geçmişi.js");
client.on("clickButton", async (button) => {
  button.defer();
  let findServer = await ppdata.findOne({ message: button.message.id });
  if(!findServer) return;
  console.log(button.id)
  let serverOne = client.guilds.cache.get(findServer.guildID);
  let serverTwo = client.guilds.cache.get(findServer.karsiSunucu);
  let serverDataOne = await pdata.findOne({ guildID: findServer.guildID });
  let serverDataTwo = await pdata.findOne({ guildID: findServer.karsiSunucu });
  let langOne = client.locale(`${serverDataOne.language}`)['partner'];
  let langTwo = client.locale(`${serverDataTwo.language}`)['partner'];
  if(button.id === "kabul") {
    if(!serverOne.me.hasPermission('MENTION_EVERYONE')) {
      client.channels.cache.get(serverDataOne.partner_log).error(langOne['yetkiyok'].replace("{yetki}", "`MENTION_EVERYONE`"));
      client.channels.cache.get(serverDataTwo.partner_log).error(langTwo['yetkiyok'].replace("{yetki}", "`MENTION_EVERYONE`"));
      return;
    } 
    if(!serverTwo.me.hasPermission('MENTION_EVERYONE')) {
      client.channels.cache.get(serverDataOne.partner_log).error(langOne['yetkiyok'].replace("{yetki}", "`MENTION_EVERYONE`"));
      client.channels.cache.get(serverDataTwo.partner_log).error(langTwo['yetkiyok'].replace("{yetki}", "`MENTION_EVERYONE`"));
      return;
    }
    if(!serverOne.me.hasPermission('SEND_MESSAGE')) {
      client.channels.cache.get(serverDataOne.partner_log).error(langOne['yetkiyok'].replace("{yetki}", "`SEND_MESSAGE`"));
      client.channels.cache.get(serverDataTwo.partner_log).error(langTwo['yetkiyok'].replace("{yetki}", "`SEND_MESSAGE`"));
      return;
    }
    if(!serverTwo.me.hasPermission('SEND_MESSAGE'))  {
      client.channels.cache.get(serverDataOne.partner_log).error(langOne['yetkiyok'].replace("{yetki}", "`SEND_MESSAGE`"));
      client.channels.cache.get(serverDataTwo.partner_log).error(langTwo['yetkiyok'].replace("{yetki}", "`SEND_MESSAGE`"));
      return;
    }
    let everyone;
    if (serverDataOne.partner_text.includes('@' + 'everyone')) everyone = true
    else false;
    let everyone2;
    if (serverDataTwo.partner_text.includes('@' + 'everyone')) everyone2 = true
    else false;
    if(everyone === true){
    client.channels.cache.get(serverDataOne.partner_kanal).send(serverDataTwo.partner_text).catch(() => {});
    } else {
    client.channels.cache.get(serverDataOne.partner_kanal).send(serverDataTwo.partner_text + '\n@everyone & @here').catch(() => {});
    }
    if(everyone2 === true){
    client.channels.cache.get(serverDataTwo.partner_kanal).send(serverDataOne.partner_text).catch(() => {});
    } else {
    client.channels.cache.get(serverDataTwo.partner_kanal).send(serverDataOne.partner_text + '\n@everyone & @here').catch(() => {});
    }
    await cData.findOneAndUpdate({userID: findServer.author }, {$inc: {amount: 3 }}, { upsert: true })
    await cData.findOneAndUpdate({userID: button.clicker.user.id }, {$inc: {amount: 3 }}, { upsert: true })

    await pdata.findOneAndUpdate({guildID: serverDataOne.guildID }, {$inc: { partner_partnerCount: 1 }}, { upsert: true })
    await pdata.findOneAndUpdate({guildID: serverDataTwo.guildID }, {$inc: { partner_partnerCount: 1 }}, { upsert: true })

    await botdatabase.findOneAndUpdate({ botID: "789918433495875584" }, {$inc: { partnerCount: 4 }}, { upsert: true })

    await cGecmis.findOneAndUpdate({userID: button.clicker.user.id }, {$push: {gecmis: { count: 3, user: "{system}", reason: 'Partner', Date: Date.now() } }}, { upsert: true});          
    await cGecmis.findOneAndUpdate({userID: findServer.author }, {$push: {gecmis: { count: 3, user: "{system}", reason: 'Partner', Date: Date.now() } }}, { upsert: true});          
    client.channels.cache.get(serverDataTwo.partner_log).messages.fetch(button.message.id).then(message => message.delete())
    const successOne = new Discord.MessageEmbed()
    .setDescription(`${langOne['partneroldu'].replace(`{memberCount}`, serverTwo.memberCount).replace(`{name}`, serverTwo.name).replace(`{yetkili}`, button.clicker.user.username)}`)
    .setColor("GREEN")
    .setAuthor(client.locale(`${serverDataOne.language}`)['bot']['header_success']);
    client.channels.cache.get(serverDataOne.partner_log).send({ embed: successOne, buttons: [] })
    const successTwo = new Discord.MessageEmbed()
    .setDescription(`${langTwo['partneroldu'].replace(`{memberCount}`, serverOne.memberCount).replace(`{name}`, serverOne.name).replace(`{yetkili}`, button.clicker.user.username)}`)
    .setColor("GREEN")
    .setAuthor(client.locale(`${serverDataTwo.language}`)['bot']['header_success']);
    client.channels.cache.get(serverDataTwo.partner_log).send({ embed: successTwo, buttons: [] })
    await ppdata.deleteOne({ message: findServer.message, author: findServer.author, guildID: findServer.guildID, karsiSunucu: findServer.karsiSunucu }); 

  } else if(button.id === "red") {
    client.channels.cache.get(serverDataTwo.partner_log).messages.fetch(button.message.id).then(message => message.delete())
    const errorOne = new Discord.MessageEmbed()
    .setDescription(`${langOne['partnerolmadi'].replace(`{memberCount}`, serverTwo.memberCount).replace(`{name}`, serverTwo.name).replace(`{yetkili}`, button.clicker.user.username)}`)
    .setColor("RED")
    .setAuthor(client.locale(`${serverDataOne.language}`)['bot']['header_error']);
    client.channels.cache.get(serverDataOne.partner_log).send({ embed: errorOne, buttons: [] })
    const errorTwo = new Discord.MessageEmbed()
    .setDescription(`${langTwo['partnerolmadi'].replace(`{memberCount}`, serverOne.memberCount).replace(`{name}`, serverOne.name).replace(`{yetkili}`, button.clicker.user.username)}`)
    .setColor("RED")
    .setAuthor(client.locale(`${serverDataTwo.language}`)['bot']['header_error']);
    client.channels.cache.get(serverDataTwo.partner_log).send({ embed: errorTwo, buttons: [] })
    await ppdata.deleteOne({ message: findServer.message, author: findServer.author, guildID: findServer.guildID, karsiSunucu: findServer.karsiSunucu }); 

  }
})
/*=======================================================================================*/

require('discord-buttons')(client);