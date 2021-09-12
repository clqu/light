const Discord = require("discord.js");
const config = require("../config.js");
const nodeFetch = require('node-fetch');
const { MessageButton } = require('discord-buttons');

module.exports = {
  run: async (client, message, args, db) => {

    let lang = client.locale(client[`serverData_${message.guild.id}`].language);
    let pageNumber = 1;
    let pageSize;
    
    let filteredCmds = config.filteredCmds;
    let fetch = await require('../database/models/server.js').findOne({ guildID: message.guild.id });
    let prefix = fetch ? (fetch.prefix || config.prefix) : config.prefix;
    
    let pages = [];
    let commands = client.commands.map(x => x).filter(x => !filteredCmds.includes(x.config.name));
    let commandsLength = commands.length.toString();
    if (![ '0', '5' ].includes(commandsLength.slice(-1))) {
      pageSize = ((parseInt(commandsLength) - (parseInt(commandsLength.slice(-1)) > 5 ? (parseInt(commandsLength.slice(-1)) - 5) : parseInt(commandsLength.slice(-1)))) / 5) + 1;
    } else {
      pageSize = parseInt(commandsLength) / 5;
    };
    let geri = new MessageButton()
      .setStyle('blurple')
      .setLabel('◀️ '+ lang['yardim']['geri'])
      .setID('geri');

    let sil = new MessageButton()
      .setStyle('red')
      .setLabel(lang['yardim']['sil'])
      .setID('sil');

    let siliniyor = new MessageButton()
      .setStyle('red')
      .setLabel(lang['yardim']['siliniyor']+'...')
      .setID('siliniyor');

    let ileri = new MessageButton()
      .setStyle('blurple')
      .setLabel(lang['yardim']['ileri']+' ▶️')
      .setID('ileri');

    let ileriD = new MessageButton()
      .setStyle('blurple')
      .setLabel(lang['yardim']['ileri']+' ▶️')
      .setDisabled(true)
      .setID('ileri');

    let geriD = new MessageButton()
      .setStyle('blurple')
      .setLabel('◀️ '+ lang['yardim']['geri'])
      .setDisabled(true)
      .setID('geri');

    for(let i = 0; i < pageSize; i++) {
      let descText = '';
	    let miniFooter = `[${lang['bot']['website']}](https://lightpartner.xyz) | [${lang['bot']['invite']}](https://lightpartner.xyz/invite) | [${lang['bot']['support']}](${config.links.support})`
      let miniDesc = `${lang['yardim']['language']}\n${lang['yardim']['prefix'].replace('{prefix}', prefix)}\n\n`
      let embed = new Discord.MessageEmbed()
        .setFooter(lang['yardim']['footer'].replace('{currentPage}', i + 1).replace('{maxPage}', pageSize), message.author.avatarURL({ dynamic: true}))
        .setAuthor(lang['yardim']['title'], client.user.avatarURL())
        .setTimestamp()
        .setColor('#F4F4F4')
        .setImage(config.embed.image);
      
      commands.slice(i * 5, (i + 1) * 5).forEach(command => descText += `> • [${prefix}${lang['commands'][command.config.name].name}](${config.links.support}) » **${lang['commands'][command.config.name].desc}**\n> **➥** __${lang['bot']['perm']}${command.config.perms.length > 1 ? lang['bot']['perms'] : ''}__**:** ${command.config.perms.length < 1 ? '``' + lang['yardim']['noReq'] + '``' : (command.config.perms.map(x => '``' + x + '``').join(', '))}\n\n`);
      embed.setDescription(miniDesc + descText + `\n`+miniFooter);
      pages.push(embed);
    };

message.channel.send({ embed: pages[0], buttons: [ geriD, sil, ileri ] }).then(async msg => {
  const filter = (button) => button.clicker.user.id === message.author.id;
  const collector = await msg.createButtonCollector(filter, { time: 60000 });

  collector.on('collect', async b => {
    if(b.id === "ileri") {
      if (pageNumber == pageSize) return b.defer();
      msg.edit({ 
        embed: pages[pageNumber],
        buttons: (pageSize - pageNumber) == 1 ? [ geri, sil, ileriD ] : [ geri, sil, ileri ]
      });
      pageNumber++;
    } else if(b.id === "geri") {
      if (pageNumber === 1) return b.defer();
      msg.edit({
        embed: pages[pageNumber - 2],
        buttons: pageNumber == 2 ? [ geriD, sil, ileri ] : [ geri, sil, ileri ]
      });
      pageNumber--;
    } else if(b.id === "sil") {
      msg.edit({
        embed: new Discord.MessageEmbed().setColor('#F4F4F4').setDescription(lang['yardim']['delete']), 
        buttons: [ geriD, siliniyor, ileriD ]
      });
      setTimeout(() => msg.delete(), 5000);
    };
    b.defer();
  });
});

},
  config: {
    name: "yardım",
    aliases: ["help"],
    desc: "",
    perms: [],
    enabled: true
  }
}; 
