const router = require('express').Router();
const config = require('../../config.js');

module.exports = (client) => {
	router.get('/data/stats', (req, res) => {
		res.json({
			guilds: client.guilds.cache.size,
			users: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
			commands: client.commands.size,
			emojis: client.emojis.cache.size
		});
	});

	return router;
};