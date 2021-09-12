module.exports = async (Discord, client, config) => {
  const serverdata = require("../database/models/server.js");
  const karaliste = require("../database/models/karaliste.js");
  const bakim = require("../database/models/bakim.js");
let newSet = new Set()


  client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    let fetch = await serverdata.findOne({ guildID: message.guild.id });
    let specialPrefix = fetch ? fetch.prefix || config.prefix : config.prefix;
    if (!message.content.startsWith(specialPrefix || config.prefix)) return;
    let command = message.content
      .split(" ")[0]
      .slice(specialPrefix ? specialPrefix.length : config.prefix.length);
    let args = message.content.split(" ").slice(1);
    let cmd;
    client.prefix = specialPrefix;
    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
      cmd = client.commands.get(client.aliases.get(command));
    }
    let predata = require("../database/models/pre.js");
    let premium = await predata.findOne({ user: message.author.id });
    client[`serverData_${message.guild.id}`] = await serverdata.findOne({ guildID: message.guild.id });
    if(!client['serverData_' + message.guild.id]) return await serverdata.updateOne({ guildID: message.guild.id }, {$set: { language: "tr-TR" }}, { upsert: true });
    let lang = client.locale(client[`serverData_${message.guild.id}`].language)['bot'];
    let swData = await serverdata.findOne({ guildID: message.guild.id });
    if(!premium) {
      if(newSet.has(message.author.id)) {
        message.delete({ timeout: 6500 });
      }
    if(swData.premium_durum) {
      if(newSet.has(message.author.id)) return message.channel.error(lang['cooldown'].replace("{sure}", "3.5 saniye")).then(msg => msg.delete({ timeout: 3500 }));
    } else {
      if(newSet.has(message.author.id)) return message.channel.error(lang['cooldown'].replace("{sure}", "7 saniye")).then(msg => msg.delete({ timeout: 7000 }));
    }
    }
    if (cmd) {
      if (client.permission(message, cmd.config.perms) == false) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(client.locale(client[`serverData_${message.guild.id}`].language)['noPerm'].replace('{x}', (specialPrefix + command)).replace('{y}', (cmd.config.perms.map(x => x).join(", ") + "`` " + (cmd.config.perms.length < 2 ? "yetkisine" : "yetkilerine"))))
        );
      } else if (cmd.config.enabled != true) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(client.locale(client[`serverData_${message.guild.id}`].language)['commandDisabled'].replace('{x}', (specialPrefix + command)))
        );
      } else {
        let bakimkontrol = await bakim.findOne({ botID: client.user.id }); 
        if(!config.developers.includes(message.author.id)) {
        if(bakimkontrol) return message.channel.error(client.locale(client[`serverData_${message.guild.id}`].language)["bot"]["bakim"]);
        }
        let karalistekontrol = await karaliste.findOne({ userID: message.author.id });
        if (!config.developers.includes(message.author.id)) { if (karalistekontrol) return message.channel.error(client.locale(client[`serverData_${message.guild.id}`].language)["bot"]["karaliste"]) };
        newSet.add(message.author.id);
        cmd.run(client, message, args, premium);
        
        if(swData.premium_durum) {
          setTimeout(() => {
          if(newSet.has(message.author.id)) {
          newSet.delete(message.author.id)
          }
          }, 7000)
        } else {
          setTimeout(() => {
          if(newSet.has(message.author.id)) {
          newSet.delete(message.author.id)
          }
          }, 3500)
        }
        
        
      }
    }
  });
};
