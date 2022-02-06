const router = require('express').Router();
const config = require('../../config.js');

module.exports = (client) => {
	router.get('/data/commands', (req, res) => {
		res.json(
            client.commands.filter(cmd => !config.filteredCmds.includes(cmd.config.name)).map(cmd => {
                return {
                    name: config.prefix + client.locale('tr-TR')['commands'][cmd.config.name].name,
                    description: client.locale('tr-TR')['commands'][cmd.config.name].desc,
                    perms: cmd.config.perms,
                    status: cmd.config.enabled == true ? 1 : 0
                };
            })
        );
	});

	return router;
};