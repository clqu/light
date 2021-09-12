const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.js");
const express = require('express');
const router = express();

const LightPartner = new Discord.ShardingManager('./main.js', {
	totalShards: 2,
  token: config.token
});

LightPartner.on('shardCreate', shard => {
    console.log(`(!) Shard başlatıldı: #${shard.id+1}`)
    shard.on('ready', () => {
    	console.log(`(!) Shard hazır: #${shard.id+1}`);
    })
    shard.on('disconnect', (a, b) => {
    	console.log(`(!) Shard bağlantısı koptu: #${shard.id+1}`); 
    })
    shard.on('reconnecting', (a, b) => {
    	console.log(`(!) Shard yeniden bağlanıyor: #${shard.id+1}`);
    })
    shard.on('death', (a, b) => {
      console.log(`(!) Shard çöktü: #${shard.id+1}`);
    })
});

LightPartner.spawn();