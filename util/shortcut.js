module.exports = (Discord, client, config) => {
  const { MessageEmbed } = require("discord.js")
  
  const embedd = new MessageEmbed();
  Discord.Channel.prototype.embed = function (mesaj, { color, title, author, fields, footer, image, thumbnail, timestamp}) {
    if(timestamp) embedd.setTimestamp();
    if(color) embedd.setColor(color)
    if(title) embedd.setTitle(title)
    if(author) embedd.setAuthor(author[0], author[1])
    if(footer) embedd.setFooter(footer[0], footer[1])
    if(image) embedd.setImage(image)
    if(thumbnail) embedd.setThumbnail(thumbnail)
    if(mesaj) embedd.setDescription(mesaj)
    return this.send(embedd);
  };
  
  const embed = new MessageEmbed();
  Discord.Channel.prototype.error = function (mesaj) {
    embed.setDescription(mesaj)
    embed.setColor("RED")
    embed.setAuthor(client.locale(client[`serverData_${this.guild.id}`].language)['bot']['header_error'])
    return this.send(embed);
  };
  
  Discord.Channel.prototype.success = function (mesaj) {
    embed.setDescription(mesaj)
    embed.setColor("GREEN")
    embed.setAuthor(client.locale(client[`serverData_${this.guild.id}`].language)['bot']['header_success'])
    return this.send(embed)
  };
  Discord.Channel.prototype.areYouSure = function (mesaj) {
    embed.setDescription(mesaj)
    embed.setColor("BLUE")
    embed.setAuthor(client.locale(client[`serverData_${this.guild.id}`].language)['bot']['header_quest'])
    return this.send(embed);
  };
  
};