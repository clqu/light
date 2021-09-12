const { MessageEmbed } = require('discord.js');
let database = require("../database/models/coin.js");
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    run: async (client, message, args) => {
        message.channel.send(
            new MessageEmbed()
                .setColor('GREEN')
                .setTitle('🐍 Yılan Oyunu')
                .setDescription('> *Oynamak için 150 coin gereklidir yılanın uzunluğu 10\'u geçerse 200 coin kazanırsınız. Elmalar rastgele spawn olmaktadır, elma oluşmazsa bir sonraki hareketinizde oluşacaktır.* \n\n> **Oynamak için "evet" yazınız!**')
        );

        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
        }).then(async sureMsg => {
            let msg = sureMsg.first();
            if (msg.content.toLowerCase() === 'evet') {
                let checkAgain = await database.findOne({ userID: message.author.id });
                if (!checkAgain || checkAgain.amount < 150) return message.channel.error('Yılan oyunu oynamak için **150** coin gereklidir!');
                await database.findOneAndUpdate({ userID: message.author.id }, {$inc: { amount: -150 }}, { upsert: true });

                const blocks = {
                    "wall": "🟦",
                    "blank": "⬛",
                    "body": "🟨",
                    "live": "😳",
                    "dead": "😵",
                    "apple": "🍎"
                };
                
                const tiles = [
                    "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦"
                ];
                
                const settings = {
                    "reward": 200,
                    "width": 11,
                    "requiredLength": 10
                };
        
                let snake = [ { val: blocks.live, key: 60 } ];
                let posibleApples = [];
                let score = snake.length;
                let route = [];
                let apple;
        
                function GameZone(kill, reason) {
                    let embed = new MessageEmbed()
                        .setColor('BLURPLE');

                    if (!kill) {
                        embed
                            .setAuthor('🐍 Uzunluk: ' + snake.length + ' | 💰 Ödül: ' + (snake.length >= settings.requiredLength ? settings.reward : 0) + ' Coin')
                            .setFooter('🎮 Oyuncu: ' + message.author.tag);
                    } else {
                        embed
                            .setTitle((reason !== 'Hasar' ? '❌ Pes ettin' : '💥 Hasar aldın') + '! | 🐍 Uzunluk: ' + snake.length + ' | 💰 Ödül: ' + (snake.length >= settings.requiredLength ? settings.reward : 0) + ' Coin')
                    };
                    
                    snake.forEach(part => {
                        tiles[part.key] = part.val;
                    });

                    posibleApples = [];
                    tiles.forEach((tile, index) => {
                        if (tile === blocks.blank) posibleApples.push(index);
                    });
                    
                    if (!tiles.find(tile => tile === blocks.apple) || snake.some(part => part.key == apple)) {
                        let generateApple = posibleApples[Math.floor(Math.random() * posibleApples.length)];
                        tiles[generateApple] = blocks.apple;
                        apple = generateApple;
                    };

                    return embed.setDescription(tiles.map((tile, index) => {
                        return tile + ((index + 1) % parseInt(settings.width) == 0 ? '\n' : '');
                    }).join(''));
                };
        
                async function moveSnake(msg, to) {
                    const sizes = {
                        up: [ parseInt(settings.width) ],
                        down: [ parseInt('-' + settings.width) ],
                        left: [ 1 ],
                        right: [ -1 ]
                    };
                    
                    const key = snake
                        .find(part => part.val === blocks.live)
                        .key;
                    
                    if (key) {
                        if ([ blocks.body, blocks.wall ].includes(tiles[key - sizes[to][0]])) {
                            snake[0].val = blocks.dead;
                            msg.reactions.removeAll();
                            
                            if (snake.length >= settings.requiredLength) {
                                await database.findOneAndUpdate({ userID: message.author.id }, {$inc: { amount: 200 }}, { upsert: true });
                            };

                            msg.edit({
                                embed: GameZone(true, 'Hasar')
                            });
                        } else {
                            route = [key - sizes[to][0], ...route];
                            if (tiles[key - sizes[to][0]] === blocks.apple) snake.push({ val: blocks.body, key: key });
                
                            snake.forEach((part, index) => {
                                tiles[snake[index].key] = blocks.blank;
                                snake[index].key = route[index];
                            });
                
                            msg.edit({
                                embed: GameZone()
                            });
                        };
                    };
                };
        
                message.channel.send(
                    new MessageEmbed()
                        .setColor('BLURPLE')
                        .setDescription('❗ **|** Yükleniyor**,** lütfen bekleyin**...**')
                ).then(msg => {
                    msg.react('🔼').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '🔼' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            moveSnake(msg, 'up');
                        });
                    });
                    
                    msg.react('🔽').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '🔽' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            moveSnake(msg, 'down');
                        });
                    });
                    
                    msg.react('◀️').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '◀️' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            moveSnake(msg, 'left');
                        });
                    });
                    
                    msg.react('▶️').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '▶️' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            moveSnake(msg, 'right');
                        });
                    });
                    
                    msg.react('🔁').then(r => {
                        msg.edit({ embed: GameZone() });
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '🔁' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            if (snake.length >= settings.requiredLength) {
                                await database.findOneAndUpdate({ userID: message.author.id }, {$inc: { amount: 200 }}, { upsert: true });
                            };

                            msg.reactions.removeAll();
                            msg.edit({ embed: GameZone(true, 'Yeniden Başlatma') });
                        });
                    });
                });
            };
        });
    },
    config: {
        name: 'snake',
        aliases: ['yılan'],
        desc: 'Yılan Oyunu',
        perms: [],
        enabled: true
    }
};