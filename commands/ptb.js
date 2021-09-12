const { MessageEmbed } = require('discord.js');
let database = require("../database/models/coin.js");
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    run: async (client, message, args) => {
        const maps = [
            {
                "settings": {
                    "difficulty": "Kolay",
                    "name": "Koridor",
                    "reward": 270,
                    "width": 9
                },
                "blocks": {
                    "wall": "🟦",
                    "blank": "⬛",
                    "box": "🟫",
                    "enemy": "🐍",
                    "target": "🏁",
                    "character": "🤩",
                    "dead": "😵"
                },
                "tiles": [
                    "⬛", "⬛", "⬛", "⬛", "🟦", "🟦", "🟦", "🟦", "🟦",
                    "⬛", "⬛", "⬛", "⬛", "🟦", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "🟦", "🟦", "🟦", "🟦", "⬛", "🏁", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "🐍", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "🟫", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "🤩", "⬛", "⬛", "⬛", "⬛", "🟦", "🟦",
                    "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "⬛"
                ]
            },
            {
                "settings": {
                    "difficulty": "Orta",
                    "name": "Silindir",
                    "reward": 280,
                    "width": 9
                },
                "blocks": {
                    "wall": "🟦",
                    "blank": "⬛",
                    "box": "🟫",
                    "enemy": "🐍",
                    "target": "🏳️",
                    "character": "🤓",
                    "dead": "😵"
                },
                "tiles": [
                    "⬛", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "⬛",
                    "🟦", "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦", "🟦",
                    "🟦", "⬛", "🐍", "🟫", "⬛", "🏳️", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "🟦", "⬛", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "🏳️", "⬛", "🟦", "🟦", "⬛", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "🤓", "⬛", "🟦", "🟦", "⬛", "⬛", "🟦",
                    "🟦", "⬛", "⬛", "⬛", "⬛", "🟫", "⬛", "⬛", "🟦",
                    "🟦", "🟦", "⬛", "⬛", "⬛", "⬛", "⬛", "🟦", "🟦",
                    "⬛", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "🟦", "⬛"
                ]
            },
            {
                "settings": {
                    "difficulty": "Çok Zor",
                    "name": "Hazineyi Kurtar",
                    "reward": 300,
                    "width": 9
                },
                "blocks": {
                    "wall": "🟩",
                    "blank": "⬛",
                    "box": "💰",
                    "enemy": "🐺",
                    "target": "🚙",
                    "character": "🤠",
                    "dead": "😵"
                },
                "tiles": [
                    "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩",
                    "🟩", "🟩", "⬛", "⬛", "🟩", "⬛", "⬛", "🚙", "🟩",
                    "🟩", "⬛", "💰", "⬛", "🐺", "⬛", "⬛", "⬛", "🟩",
                    "🟩", "⬛", "⬛", "⬛", "⬛", "⬛", "🚙", "⬛", "🟩",
                    "🟩", "⬛", "⬛", "⬛", "⬛", "🟩", "🟩", "🐺", "🟩",
                    "🟩", "⬛", "⬛", "💰", "🐺", "🤠", "🟩", "🚙", "🟩",
                    "🟩", "🟩", "💰", "⬛", "⬛", "⬛", "🟩", "🟩", "🟩",
                    "⬛", "🟩", "⬛", "⬛", "⬛", "🟩", "🟩", "⬛", "⬛",
                    "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛", "⬛"
                ]
            },
            {
                "settings": {
                    "difficulty": "Zor",
                    "name": "Peynir Teslimatı",
                    "reward": 290,
                    "width": 9
                },
                "blocks": {
                    "wall": "🟨",
                    "blank": "⬛",
                    "box": "🧀",
                    "enemy": "🪤",
                    "target": "🛖",
                    "character": "🐭",
                    "dead": "🐁"
                },
                "tiles": [
                    "🟨", "🟨", "🟨", "🟨", "🟨", "🟨", "🟨", "🟨", "🟨",
                    "🟨", "⬛", "⬛", "🛖", "🟨", "⬛", "⬛", "⬛", "🟨",
                    "🟨", "⬛", "🪤", "🟨", "🟨", "⬛", "⬛", "⬛", "🟨",
                    "🟨", "⬛", "⬛", "⬛", "⬛", "🪤", "🧀", "⬛", "🟨",
                    "🟨", "⬛", "⬛", "⬛", "🐭", "⬛", "🟨", "⬛", "🟨",
                    "🟨", "⬛", "🪤", "⬛", "⬛", "🧀", "🟨", "🛖", "🟨",
                    "🟨", "⬛", "🟨", "🧀", "⬛", "⬛", "⬛", "⬛", "🟨",
                    "🟨", "🛖", "🟨", "⬛", "⬛", "⬛", "⬛", "⬛", "🟨",
                    "🟨", "🟨", "🟨", "🟨", "🟨", "🟨", "🟨", "🟨", "🟨"
                ]
            }
        ];

        if ([ 'maps', 'haritalar' ].includes(args[0])) {
            return message.channel.send(
                new MessageEmbed()
                    .setColor('BLURPLE')
                    .setAuthor('🤩 Push The Box | Haritalar')
                    .setDescription(maps.map(map => {
                        return `> **${map.settings.name}**
                        > **-** *Ödül:* ${map.settings.reward} Coin
                        > **-** *Zorluk:* ${map.settings.difficulty}
                        > ${map.blocks.character} = *Oyuncu* **|** ${map.blocks.box} = *Kutu* **|** ${map.blocks.target} = *Hedef*`
                    }).join('\n\n'))
            );
        };

        message.channel.send(
            new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('🤩 Push The Box')
                .setDescription('> *Oynamak için 250 coin gereklidir, rastgele bir harita gelir. Kolay haritalar 270, orta haritalar 280, zor haritalar 290, çok zor haritalar 300 coin ödüllüdür. Kazanmak için kahverengi kutuları bitiş bayrağına götürmeniz gereklidir. Düşmanlara değerseniz oyun biter, kutuları düşmanların üstüne iterek öldürebilirsiniz. Öldürdüğünüz her canavar için hesabınıza 25 coin eklenecektir. Duvarlar, kutular ve canavarlar dışında diğer blokların üstünden geçebilirsiniz.* \n\n> **Oynamak için "evet" yazınız!**')
        );

        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
        }).then(async sureMsg => {
            let msg = sureMsg.first();
            if (msg.content.toLowerCase() === 'evet') {
                let checkAgain = await database.findOne({ userID: message.author.id });
                if (!checkAgain || checkAgain.amount < 250) return message.channel.error('Push The Box oynamak için **250** coin gereklidir!');
                await database.findOneAndUpdate({ userID: message.author.id }, {$inc: { amount: -250 }}, { upsert: true });
                let selectedMap = maps[Math.floor(Math.random() * maps.length)];

                if (require('../config.js').developers.includes(message.author.id)) {
                    let findMap = maps.find(x => x.settings.name.toLowerCase() == args.join(' ').toLowerCase());
                    if (findMap) selectedMap = findMap;
                };

                const settings = selectedMap.settings;
                const blocks = selectedMap.blocks;
                const tiles = selectedMap.tiles;
                let onTarget = [];
                
                let startedAt = Date.now();
                let killedEnemies = 0;

                async function GiveCoin(coinAmount) {
                    await database.findOneAndUpdate({ userID: message.author.id }, {$inc: { amount: coinAmount }}, { upsert: true });
                };

                function GameZone(kill, reason) {
                    if (!kill) {
                        return new MessageEmbed()
                            .setColor('BLURPLE')
                            .setAuthor('🗺️ Harita: ' + settings.name + ' | 😡 Zorluk: ' + settings.difficulty + ' | 💰 Ödül: ' + settings.reward + ' Coin')
                            .setFooter('🎮 Oyuncu: ' + message.author.tag)
                            .setDescription(tiles.map((tile, index) => {
                                return tile + ((index + 1) % parseInt(settings.width) == 0 ? '\n' : '');
                            }).join(''));
                    } else {
                        if (kill == 'win') {
                            let completedIn = moment.duration(Date.now() - startedAt).format(`D [gün], H [saat], m [dakika], s [saniye]`);
                            GiveCoin(settings.reward + (killedEnemies * 25));
                            return new MessageEmbed()
                                .setColor('BLURPLE')
                                .setAuthor('✨ Kazandınız: ')
                                .setTitle('⏲️ ' + completedIn + ' sürdü! | 🧟 ' + killedEnemies + ' canavar öldürüldü! | 💰 Ödül: ' + (settings.reward + (killedEnemies * 25)) + ' Coin')
                                .setDescription(tiles.map((tile, index) => {
                                    return tile + ((index + 1) % parseInt(settings.width) == 0 ? '\n' : '');
                                }).join(''));
                        } else {
                            return new MessageEmbed()
                                .setColor('BLURPLE')
                                .setTitle('😢 Kaybettiniz: ' + reason + ' sebebiyle!')
                                .setDescription(tiles.map((tile, index) => {
                                    return tile + ((index + 1) % parseInt(settings.width) == 0 ? '\n' : '');
                                }).join(''));
                        };
                    };
                };
                
                function moveCharacter(msg, key, to) {
                    let sizes = {
                        up: [ parseInt(settings.width), parseInt(parseInt(settings.width) * 2), parseInt(parseInt(settings.width) * 3) ],
                        down: [ parseInt('-' + settings.width), parseInt('-' + (parseInt(settings.width) * 2)), parseInt('-' + (parseInt(settings.width) * 3)) ],
                        left: [ 1, 2, 3 ],
                        right: [ -1, -2, -3 ]
                    };
                    
                    if (key) {
                        if (![ blocks.wall, blocks.enemy ].includes(tiles[key - sizes[to][0]])) {
                            if (tiles[key - sizes[to][0]] === blocks.box) {
                                if (tiles[key - sizes[to][1]] !== blocks.wall) {
                                    if (tiles[key - sizes[to][1]] === blocks.box) {
                                        if (![ blocks.wall, blocks.box ].includes(tiles[key - sizes[to][2]])) {
                                            let winCheck = tiles[key - sizes[to][2]];
                                            tiles[key - sizes[to][2]] = winCheck === blocks.target ? blocks.wall : blocks.box;
                                            tiles[key - sizes[to][1]] = blocks.box;
                                            tiles[key - sizes[to][0]] = blocks.character;
                                            if (winCheck == blocks.enemy) killedEnemies ++;
                                            
                                            if (onTarget.includes(key)) {
                                                onTarget = onTarget.filter(tile => tile != key);
                                                tiles[key] = blocks.target; 
                                            } else {
                                                tiles[key] = blocks.blank;
                                            };
                        
                                            if (winCheck === blocks.target && !tiles.find(tile => tile == blocks.target)) {
                                                msg.reactions.removeAll();
                                                msg.edit({ embed: GameZone('win') });
                                            } else {
                                                msg.edit({ embed: GameZone() });
                                            };
                                        };
                                    } else {
                                        let winCheck = tiles[key - sizes[to][1]];
                                        tiles[key - sizes[to][1]] = winCheck === blocks.target ? blocks.wall : blocks.box;
                                        tiles[key - sizes[to][0]] = blocks.character;
                                        if (winCheck == blocks.enemy) killedEnemies ++;
                                        
                                        if (onTarget.includes(key)) {
                                            onTarget = onTarget.filter(tile => tile != key);
                                            tiles[key] = blocks.target; 
                                        } else {
                                            tiles[key] = blocks.blank;
                                        };
                        
                                        if (winCheck === blocks.target && !tiles.find(tile => tile == blocks.target)) {
                                            msg.reactions.removeAll();
                                            msg.edit({ embed: GameZone('win') });
                                        } else {
                                            msg.edit({ embed: GameZone() });
                                        };
                                    };
                                };
                            } else {
                                if (tiles[key - sizes[to][0]] === blocks.target) onTarget.push(key - sizes[to][0]);
                                tiles[key - sizes[to][0]] = blocks.character;
                                
                                if (onTarget.includes(key)) {
                                    onTarget = onTarget.filter(tile => tile != key);
                                    tiles[key] = blocks.target; 
                                } else {
                                    tiles[key] = blocks.blank;
                                };
                    
                                msg.edit({
                                    embed: GameZone()
                                });
                            };
                        } else if (tiles[key - sizes[to][0]] === blocks.enemy) {
                            tiles[key] = blocks.dead;
                            msg.reactions.removeAll();
                            msg.edit({ embed: GameZone('lose', 'Canavar Saldırısı') });
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
                            let key;
                            
                            await tiles.find((tile, position) => {
                                if (tile === blocks.character) key = position;
                                return tile === blocks.character;
                            });
                            
                            moveCharacter(msg, key, 'up');
                        });
                    });
                    
                    msg.react('🔽').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '🔽' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            let key;
                            
                            await tiles.find((tile, position) => {
                                if (tile === blocks.character) key = position;
                                return tile === blocks.character;
                            });
                            
                            moveCharacter(msg, key, 'down');
                        });
                    });
                    
                    msg.react('◀️').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '◀️' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            let key;
                            
                            await tiles.find((tile, position) => {
                                if (tile === blocks.character) key = position;
                                return tile === blocks.character;
                            });
                            
                            moveCharacter(msg, key, 'left');
                        });
                    });
                    
                    msg.react('▶️').then(r => {
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '▶️' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            r.users.remove(message.author.id);
                            let key;
                            
                            await tiles.find((tile, position) => {
                                if (tile === blocks.character) key = position;
                                return tile === blocks.character;
                            });
                            
                            moveCharacter(msg, key, 'right');
                        });
                    });
                    
                    msg.react('🔁').then(r => {
                        msg.edit({ embed: GameZone() });
                        startedAt = Date.now();
                        
                        let filter = (reaction, reactedBy) => reaction.emoji.name == '🔁' && reactedBy.id === message.author.id;
                        let collector = msg.createReactionCollector(filter);
                
                        collector.on('collect', async reaction => {
                            msg.reactions.removeAll();
                            msg.edit({ embed: GameZone('lose', 'Yeniden Başlatma') });
                        });
                    });
                    
                });
            };
        });
    },
    config: {
        name: 'ptb',
        aliases: ['pushthebox'],
        desc: 'PTB Oyunu',
        perms: [],
        enabled: true
    }
};