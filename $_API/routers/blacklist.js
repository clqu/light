const karaliste = require('../../database/models/karaliste.js');
const router = require('express').Router();
const config = require('../../config.js');

module.exports = (client) => {
	router.get('/blacklist/fetch', async (req, res) => {
		const id = req.query.id;
        if (!id) return res.json(false);

        const fetch = await karaliste.findOne({ userID: id });
        if (!config.developers.includes(id) && fetch) {
            res.json(true);
        } else {
            res.json(false);
        };
	});

	return router;
};