const Discord = require("discord.js");
let database = require("../database/models/karaliste.js");
const moment = require("moment");
module.exports = {
    run: async (client, message, args) => {
  let db = database;
  const kara = args[0]; 
  const sebep = args.slice(2).join(" ");
  let user = message.mentions.users.first() || await client.users.fetch(args[1]); 
  user.tag = user.username + '#' + user.discriminator;

  if (kara == "al") {
    if (!user)
      return message.channel.error(":x: | Bir üye etiketlemeli veya bir kullanıcı kimliği belirtmelisin.");
    if (!sebep) return message.channel.error(":x: | Sebep belirtmelisin.");
    new database({ userID: user.id, yetkili: message.author.id, süre: Date.now(), sebep: sebep}).save();
    return message.channel.success(`**\`${user.tag}\` isimli kullanıcı \`${sebep}\` sebebiyle karalisteye alındı.**`)
  } else if (kara == "çıkar") {
    if (!user)    
      return message.channel.error(":x: | Bir üye etiketlemeli veya bir kullanıcı kimliği belirtmelisin.");
    let lightdata = await database.findOne({ userID: user.id})
    if (!lightdata)
      return message.channel.error(":x: | Bu kullanıcı karalistede bulunmuyor.");
    let aylartoplam = {
      "01": "Ocak",
      "02": "Şubat",
      "03": "Mart",
      "04": "Nisan",
      "05": "Mayıs",
      "06": "Haziran",
      "07": "Temmuz",
      "08": "Ağustos",
      "09": "Eylül",
      "10": "Ekim",
      "11": "Kasım",
      "12": "Aralık"
    };
    let aylar = aylartoplam;
    let rol = "";

    require("moment-duration-format");
    let wensj = lightdata.süre;
    const duration = moment
      .duration(Date.now() - wensj)
      .format(" D [gün], H [saat], m [dakika], s [saniye]");
    let ytag;
    let utag;
    client.users.fetch(lightdata.yetkili).then(yetkili => {
    client.users.fetch(lightdata.userID).then(user => {
    return embed(`
**:question: | \`${user.tag}\` isimli kullanıcıyı karalisteden çıkar istediğinizden emin misiniz?**

> • __Karaliste Sebebi__**:** \`${lightdata.sebep}\`
> • __Yetkili Kullanıcı__**:** \`${yetkili.tag}\`
> • __Karalisteye Alınma Tarihi__**:** \`${moment(wensj).format("DD")} ${
      aylar[moment(wensj).format("MM")]
    } ${moment(wensj).format("YYYY HH:mm:ss")}\`
> • __Karaliste Süresi__**:** \`${duration}\`
    `).then(async wenbayrak => {
      await wenbayrak.react("✅");
      await wenbayrak.react("❌");
      const filter = (reaction, user) => {
        return (
          ["✅", "❌"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };
      wenbayrak
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then(async collected => {
          const reaction = collected.first();

          if (reaction.emoji.name === "✅") {  
            await db.deleteOne({ userID: user.id });
            let bayrakwenqwe = new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag)
              .setThumbnail(client.user.avatarURL())
              .setDescription(`\`${user.tag}\` isimli kullanıcı karalisteden çıkarıldı.`);
            wenbayrak.edit(bayrakwenqwe);
          } else {  
            let bayrakwenqwe = new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag)
              .setThumbnail(client.user.avatarURL())
              .setDescription(`İşlem iptal edildi!`);
            wenbayrak.edit(bayrakwenqwe);
          }
        })
        .catch(err => {
          let bayrakwenqwe = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setThumbnail(client.user.avatarURL())
            .setDescription(`OROSPULAR HATA VARR HATAA`);
          wenbayrak.edit(bayrakwenqwe);
        });
    });
          })
    })
  } else {
    return message.channel.error("Geçersiz argüman! Argümanlar: `al` `çıkar`");
  }
  async function embed(text) {
    //Bayrak & WenSamita Neiva
    const embed = new Discord.MessageEmbed() //Bayrak & WenSamita Neiva
      .setColor("BLUE") //Bayrak & WenSamita Neiva
      .setThumbnail(message.author.avatarURL({ dynamic: true }))
      .setAuthor(
        //Bayrak & WenSamita Neiva
        message.author.tag, //Bayrak & WenSamita Neiva
        message.author.avatarURL({ dynamic: true }) //Bayrak & WenSamita Neiva
      ) //Bayrak & WenSamita Neiva
      .setDescription(`${text}`) //Bayrak & WenSamita Neiva
      .setTimestamp() //Bayrak & WenSamita Neiva
      .setFooter(client.user.username, client.user.avatarURL()); //Bayrak & WenSamita Neiva
    let msg = await message.channel.send(embed); //Bayrak & WenSamita Neiva
    return msg; //Bayrak & WenSamita Neiva
  }
    },
    config: {
        name: 'karaliste',
        desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
        aliases: [],
        perms: [ 'DEVELOPER' ],
        enabled: true
    }
};