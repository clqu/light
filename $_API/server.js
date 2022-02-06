module.exports = (Discord, client) => {

/*============================================================================*/

const session = require('express-session');
const express = require('express');
const router = express();

/*============================================================================*/

router.use(
	session({
	  secret: "55CWSa21QbGeNxiJX3HngI7gm_F5bEGiZMGDu5rcUlDqILu1K9q_m4wDHDX3Prk84xurn9gyZgVIr",
	  resave: false,
	  saveUninitialized: false
	})
);

router.use(require('body-parser').json());
router.use(require('body-parser').urlencoded({ extended: true }));

router.use(require('cors')({
	origin: 'https://www.lightbot.me'
}));

/*============================================================================*/

const auth_router = require('./routers/auth.js')(client);
router.use(auth_router);

const config_router = require('./routers/config.js')(client);
router.use(config_router);

const stats_router = require('./routers/stats.js')(client);
router.use(stats_router);

const blog_router = require('./routers/blog.js')(client);
router.use(blog_router);

const promo_router = require('./routers/promo-code.js')(client);
router.use(promo_router);

const commands_router = require('./routers/commands.js')(client);
router.use(commands_router);

const bl_router = require('./routers/blacklist.js')(client);
router.use(bl_router);

/*============================================================================*/

router.use((req, res) => {
	res.json({
		success: false,
		code: 404,
		message: 'Not Found'
	});
});

/*============================================================================*/

router.listen(3000, () => {
	console.log("(!) Site API listening at ::3000");
});

/*============================================================================*/

};