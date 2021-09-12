const Discord = require("discord.js");
let db = require("../database/models/kod-data.js");

module.exports = {
  run: async (client, message, args) => { 
    if(!args[0]) return message.channel.error('Argmüman belirt! \n `oluştur`, `listele`, `sil`')
    let lang = client.locale(client[`serverData_${message.guild.id}`].language)['code'];
    let glang = client.locale(client[`serverData_${message.guild.id}`].language)['quest'];
    if(args[0] === "oluştur") {
      if(!args[1]) return message.channel.error(":x: Bir kullanım miktarı girmelisin.");
      if(!args[2]) return message.channel.error(":x: Bir coin miktarı girmelisin.");
      let kodd = "LP-"+idCreate(4)+"-"+idCreate(4)+"-"+idCreate(4);
      message.channel.success(`Kod başarıyla oluşturuldu.\n\n> __Kod__**:** \`${kodd}\` \n> __Link__**:** [Tıkla ve Kullan](https://lightpartner.xyz/promo-code?code=${kodd})`);
      await db.updateOne({kod: kodd}, {$set: {kullanim: 0, usage: args[1], users: [], prize: args[2]}},{upsert: true})
    }
    if(args[0] === "liste") {
      let database = await db.find();
      const embed = new Discord.MessageEmbed().setTitle("Promosyon Kodları").setColor("#F4F4F4");
      const bluredEmbed = new Discord.MessageEmbed().setTitle("Promosyon Kodları").setColor("#F4F4F4");
      
      let codes = '';
      let bluredCodes = '';
      let limits = '';
      let coins = '';
      
      await database.map(a => {
        bluredCodes += '> ``' + '⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎'.slice(0, a.kod.length) + '``\n ';
        codes += '> ``' + a.kod + '``\n ';
        limits += '> ``' + (a.kullanim + '/' + a.usage) + '``\n ';
        coins += '> ``' + a.prize + '``\n ';
      });
      
      embed
        .addField("> ᴘʀᴏᴍᴏꜱʏᴏɴ ᴋᴏᴅᴜ", codes, true)
        .addField("> ʟɪᴍɪᴛ", limits, true)
        .addField("> ᴄᴏɪɴ", coins, true);
      
      bluredEmbed
        .addField("> ᴘʀᴏᴍᴏꜱʏᴏɴ ᴋᴏᴅᴜ", bluredCodes, true)
        .addField("> ʟɪᴍɪᴛ", limits, true)
        .addField("> ᴄᴏɪɴ", coins, true);
      
      message.channel.send(bluredEmbed).then(msg => {
        msg.react('👁️').then(reaction => {
          let filter = (react, reactedBy) => react.emoji.name == '👁️' && reactedBy.id == message.author.id;
          let collector = msg.createReactionCollector(filter);

          collector.on('collect', async r => {
            msg.reactions.removeAll();
            msg.edit({ embed });
          });
        });
      });
    }
    if(args[0] === "sil") {
      let kodd = args[1];
      if(!kodd) return message.channel.error("Bir kod girmelisin.");
      let a = await db.findOne({ kod: kodd });
      if(!a) return message.channel.error("Geçersiz bir kod girdiniz.");
      message.channel.areYouSure(`**${a.kod}** kodunu silmek istediğinizden emin misiniz? \`(evet/hayır)\`\n> Kullanım: ${a.kullanim}/${a.usage}\n> Coin: ${a.prize}`)
              message.channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          })
          .then(async message => {
            message = message.first();
              if (message.content.toLowerCase() === "evet") {
              await db.deleteOne({ kod: kodd });
              return message.channel.success("Kod başarıyla silindi.");
            } else if (message.content.toLowerCase() === "hayır") {
              return message.channel.error("Kod silme işlemi iptal edildi.");
            }
          })
          .catch(collected => {
            message.channel.error(glang['timeout']);
          });
    }    
  },
  config: {
    name: "kod",
    aliases: [],
    desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
    perms: [ 'DEVELOPER' ],
    enabled: true
  }
};  
function idCreate(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
}