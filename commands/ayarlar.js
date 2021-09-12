const Discord = require("discord.js");
let database = require("../database/models/server.js");

module.exports = {
  run: async (client, message, args) => {
    let lang = client.locale(client['serverData_' + message.guild.id].language);
    if (!args[0]) return message.channel.error(client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["argss"]);
    
    /*=================================================================================*/
    
    if (args[0] === lang['ayarlar']['args']['prefix']) {
      if (!args[1])
        return message.channel.error(
          client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["prefixgir"]
        );
      if (args[1] != client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["sifirla"]) {
        if (args[1].length > 5)
          return message.channel.error(
            client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["prefixerr"]
          );
        message.channel.success(
          client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["prefixdegisti"]
        );
        await database.updateOne(
          { guildID: message.guild.id },
          { $set: { prefix: args[1] } },
          { upsert: true }
        );
      }
      if (args[1] === client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["sifirla"]) {
        let docs = await database.findOne({ guildID: message.guild.id });
        message.channel.success(
          client.locale(client['serverData_' + message.guild.id].language)["ayarlar"]["prefixsifirlandi"]
        );
        let prefix = docs ? docs.prefix : null;  
        if (!prefix)
          return message.channel.error(
            client.locale(client['serverData_' + message.guild.id].language)["ayarlar"][
              "prefixayarlaonce"
            ]
          );
        await database.updateOne(
          { guildID: message.guild.id },
          { $set: { prefix: null } },
          { upsert: true }
        );
      }
    }
    
    /*=================================================================================*/
    
    if (args[0] === lang['ayarlar']['args']['dil']) {
      require('fs').readdir('./lang', async (err, files) => {
        let response = '';
        await files.forEach(file => {
          let langFile = require('../lang/' + file);
          response += langFile['$package']['flag'] + ' `' + langFile['$package']['name'] + ' (' + file.split('.')[0] + ')`\n'
        });
        
        if (!args[1]) return message.channel.send(
          new Discord.MessageEmbed()
            .setColor('#F4F4F4')
            .setAuthor(lang['ayarlar']['language']['selectLang'], client.user.avatarURL())
            .setDescription('> __'+lang['ayarlar']['language']['activeLangs']+' (' + files.length + ')__**:**\n\n' + response)
            .setFooter(lang['ayarlar']['hataFooter'].replace('{language}', lang['$package']['name']))
            .setTimestamp()
        );

        try {
          let langFile = require('../lang/' + args[1] + '.json');
          message.channel.success(lang['ayarlar']['language']['success'].replace("{language}", langFile['$package']['name']));
          
          await database.updateOne(
            { guildID: message.guild.id },
            { $set: { language: args[1] } },
            { upsert: true }
          );
        } catch {
          message.channel.error(lang['ayarlar']['language']['invalidLang']);
        };
      });
    }
    
    /*=================================================================================*/
  },
  config: {
    name: "ayarlar",
    aliases: ["settings"],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [ 'MANAGE_GUILD' ],
    enabled: true
  }
};
