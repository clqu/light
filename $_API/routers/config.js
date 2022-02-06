const bakım = require('../../database/models/bakim.js');
const router = require('express').Router();
const config = require('../../config.js');

module.exports = (client) => {
	router.get('/data/config', async (req, res) => {
		const check = await bakım.findOne({ botID: client.user.id || '789918433495875584' });

		res.json({
			prefix: config.prefix || '!',
			maintenance: check ? true : false,
			developers: config.developers ? config.developers.map(id => {
				let user = client.users.cache.get(id);

				if (user) {
					return {
						id,
						avatar: user.avatar,
						username: user.username,
						discriminator: user.discriminator
					};
				} else {
					return 'null';
				};
			}).filter(user => typeof user != 'string') : []
		});
	});

	return router;
};