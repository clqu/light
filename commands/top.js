const Discord = require('discord.js');
let db = require("../database/models/coin.js");
module.exports = {
    run: async (client, message, args) => {
      
      db.find({}, async function (err, docs) { 
        
        let desc = '';
                                        
        docs.sort((a,b) => b.amount - a.amount).slice(0, 10).filter(x => x.amount > 0).map((a, index) => {
        client.users.fetch(a.userID).then(user => {
        desc += `> • **${index+1}.** __${user.tag}__ **»** :coin: \`${a.amount}\`\n`;
        })
        })
        let mauthor = await db.findOne({ userID: message.author.id});
        message.channel.embed(desc, { title: " ", color: "#F4F4F4", footer: [message.author.tag+` » ${mauthor ? (mauthor.amount || 0) : 0} Coin`, message.author.avatarURL({dynamic: true})], author: ['Light Partner - Top 10',message.author.avatarURL({dynamic: true})], thumbnail: client.user.avatarURL() })
  
      })
    },
    config: {
        name: 'top',
        aliases: ['top'],
        desc: 'açıklama',
        perms: [],
        enabled: true
    }
};