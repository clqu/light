const Strategy = require("passport-discord").Strategy;
const router = require('express').Router();
const passport = require('passport');

passport.use(new Strategy({
	clientID: "789918433495875584",
	clientSecret: "gmJewO0fd_bbQ89_guQ31SxP1gmJcijL",
	callbackURL: "https://api.lightbot.me/auth/callback",
	scope: [ "identify", "guilds" ]
}, (accessToken, refreshToken, profile, done) => {
	process.nextTick(() => done(null, profile));
}));

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

router.use(passport.initialize());
router.use(passport.session());

module.exports = (client) => {
	const DOMAIN = 'www.lightbot.me';
	const PROTOCOL = 'https';
	const PATH = '/api/auth/callback';

	router.get("/auth/login", (req, res, next) => {
		req.session._authCallback = req.query.url || '/';
		next();
	}, passport.authenticate("discord", {
		scope: [ "identify", "guilds" ],
		prompt: "none"
	}));

	router.get("/auth/callback", passport.authenticate("discord", {
		failureRedirect: "/auth/login"
	}), async (req, res) => {
		if (req.user) {
			res.redirect((PROTOCOL + '://' + DOMAIN + PATH) + ('?code=' + req.user.accessToken) + ('&url=' + (req.session._authCallback || '/')));
		} else {
			res.redirect('/auth/login');
		};
	});

	return router;
};