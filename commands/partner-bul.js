  const Discord = require("discord.js");
const partnerdata = require("../database/models/server.js");

module.exports = {
  run: async (client, message, args, db) => {
    const lang = client.locale(client[`serverData_${message.guild.id}`].language)['partner']['search']
partnerdata.find({}, function (err, docs) { 
const filteredGuilds = docs.filter(x => x.partner_durum === "Aktif")
const generateEmbed = start => {
  
    let guilds = filteredGuilds
    .filter(x => x.premium_durum == 'Aktif')
    .concat(
      filteredGuilds.filter(x => x.premium_durum != 'Aktif')
    );

  const current = guilds.slice(start, start + 5)
  let servers = '';
  if(guilds.length <= 0) { 
    servers = lang['serverNotFound']
  }
  current.forEach(async g => {  
    let guild = client.guilds.cache.get(g.guildID);
	let owner = client.users.cache.get(guild.ownerID);
    if(guilds.length > 0) return servers += `
    > ${g.premium_durum == 'Aktif' ? '**[\\🗝️]** ' : ''} • [${guild.name}](https://lightpartner.xyz/dc)
    > **»** __Davet Kodu__**:** ${'``' + g.partner_inviteURL + '``'}
    > **»** __Sunucu Sahibi__**:** \`\`${owner ? owner.tag : 'undefined#0000'}\`\`
    > **»** __Kullanıcı Sayısı__**:** ${'``' + guild.memberCount + '``'}
    > **»** __Toplam Partnerlik__**:** ${'``' + g.partner_partnerCount + '``'}
    > **»** __Davet Bağlantısı__**:** **[lightpartner.xyz/i/${g.partner_inviteURL}](https://lightpartner.xyz/i/${g.partner_inviteURL})**\n\n`;
  }) 
  const embed = new Discord.MessageEmbed()
    .setDescription(servers)
    .setColor("#F4F4F4")
    .setAuthor(lang['title'], client.user.avatarURL())
    .setFooter(lang['footer'], message.author.avatarURL({dynamic: true}))
    .setTimestamp();
  return embed;
}

const author = message.author

message.channel.send(generateEmbed(0)).then(message => {
  if (filteredGuilds.length <= 5) return
  message.react('➡️')
  const collector = message.createReactionCollector(
    (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
    {time: 60000}
  )

  let currentIndex = 0
  collector.on('collect', reaction => {
    message.reactions.removeAll().then(async () => {
      reaction.emoji.name === '⬅️' ? currentIndex -= 5 : currentIndex += 5
      message.edit(generateEmbed(currentIndex))
      if (currentIndex !== 0) await message.react('⬅️')
      if (currentIndex + 5 < filteredGuilds.length) message.react('➡️')
    })
  })
})
})


async function getuser(id) {
try {
return await client.users.fetch(id);
} catch {
return undefined;
}
}


  },
  config: {
    name: "partner-bul",
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    aliases: ["find-partner"],
    perms: ["MANAGE_GUILD"],
    enabled: true
  }
};
