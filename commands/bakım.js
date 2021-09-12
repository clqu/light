const Discord = require("discord.js");
const db = require("../database/models/bakim.js")
const moment = require("moment");
moment.locale('tr')
module.exports = {
    run: async (client, message, args) => {
  const bakımaldıkabooooo = args[0];
  const sebep = args.slice(1).join(" ");
  if (bakımaldıkabooooo == "aç") {
    let dbkontrol = await db.findOne({ botID: client.user.id })
    if(dbkontrol) return message.channel.error("Bakım modu zaten aktif durumda.")
    if (!sebep) return message.channel.send("Bir sebep belirtmelisin.");
    new db({ botID: client.user.id, sebep: sebep, yetkili: message.author.id, süre: Date.now() }).save()
    return message.channel.success("Bakım modu başarıyla açıldı.")
  } else if (bakımaldıkabooooo == "kapat") {

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
    let getData = await db.findOne({ botID: client.user.id });
    let wensj = getData.süre;
    const duration = moment
      .duration(Date.now() - wensj)
      .format(" D [gün], H [saat], m [dakika], s [saniye]");

    client.users.fetch(getData.yetkili).then(user => {
    return embed(`
**:question: | Bakım modunu deaktif etmek istediğinizden emin misiniz?**
> Sebep: \`${getData.sebep}\`
> Yetkili: \`${user.tag}\`
> Bakım Alınma Tarihi: \`${moment(wensj).format("DD")} ${
      aylar[moment(wensj).format("MM")]
    } ${moment(wensj).format("YYYY HH:mm:ss")}\`
> Bakım Süresi: \`${duration}\`
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
            await db.deleteOne({ botID: client.user.id  });
            let bayrakwenqwe = new Discord.MessageEmbed()
              .setColor("#f4f4f4")
              .setAuthor(message.author.tag)
              .setThumbnail(client.user.avatarURL())
              .setDescription(`Bakım başarıyla kapatıldı.`);
            wenbayrak.edit(bayrakwenqwe);
          } else {
            let bayrakwenqwe = new Discord.MessageEmbed()
              .setColor("#f4f4f4")
              .setAuthor(message.author.tag)
              .setThumbnail(client.user.avatarURL())
              .setDescription(`İşlem iptal edildi.`);
            wenbayrak.edit(bayrakwenqwe);
          }
        })
        .catch(err => {
          let bayrakwenqwe = new Discord.MessageEmbed()
            .setColor("#f4f4f4")
            .setAuthor(message.author.tag)
            .setThumbnail(client.user.avatarURL())
            .setDescription(`İşlem iptal edildi.`);
          wenbayrak.edit(bayrakwenqwe);
        });
    });
 })
  } else {
    return message.reply("Geçersiz argüman! Argümanlar: `aç` `kapat`");
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
        name: 'bakım',
        desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
        aliases: [],
        perms: [ 'DEVELOPER' ],
        enabled: true
    }
};