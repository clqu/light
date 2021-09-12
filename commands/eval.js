const Discord = require('discord.js');
const tokenuyari = `Hata: Kod token korumasından dolayı çalıştırılmadı!`;            
const config = require('../config.js');
const fs = require('fs');

module.exports = {
    run: async (client, message, args) => {
        const reload = client.reload;
        if(!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`Çalıştırmak için bir kod yazmalısın!`)
                .setColor('#F4F4F4')
                .setTimestamp()
            message.channel.send({embed})
            return
        }
         const code = args.join(' '); 
        function clean(text) {
            if (typeof text !== 'string')
                text = require('util').inspect(text, { depth: 0 })
            text = text
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203))
            return text;    
        };

        const evalEmbed = new Discord.MessageEmbed().setColor('#F4F4F4')
        try {
            var evaled = clean(await eval(code));
            if(evaled.includes(config.token.slice(0, 10))) evaled = tokenuyari;
            if (evaled.constructor.name === 'Promise') evalEmbed.setDescription(`\`\`\`\n${evaled}\n\`\`\``)
            else evalEmbed.setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
            console.log('(!) ' + message.author.tag + ', eval kullandı: ' + code);
          
            const newEmbed = new Discord.MessageEmbed()
                .setTitle('📤 | Kod çalıştırıldı!')
                .setDescription(`\`\`\`js\n${evaled}\`\`\``)
                .setColor('#F4F4F4')
            message.channel.send(newEmbed);
        }
        catch (err) {
            evalEmbed.addField('Hata çıktı;', `\`\`\`js\n${err}\n\`\`\``);
            evalEmbed.setColor('#F4F4F4');
            message.channel.send(evalEmbed);
        }
    },
    config: {
        name: 'eval',
        desc: '{ "tr-TR": "açıklama", "en-GB": "description" }',
        aliases: [],
        perms: [ 'DEVELOPER' ],
        enabled: true
    }
};