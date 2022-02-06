const router = require('express').Router();
const config = require('../../config.js');
const Crypto = require('crypto-js');
const fetch = require('node-fetch');

module.exports = (client) => {
	router.get('/promo-code/use', async (req, res) => {
        const kill = (success, message) => res.json({ success, message });
		if (!req.headers['authorization']) return kill(false, 'Lütfen giriş yapınız!');
        if (!req.query['code']) return kill(false, 'Lütfen bir kod yazınız!');

        let _code = req.query['code'];
        let _year = new Date().getFullYear();
        const _decode = Crypto.AES.decrypt(req.headers['authorization'].replace('Bearer ', ''), (_year * _year).toString())
        const _token = _decode ? _decode.toString(Crypto.enc.Utf8) : null;

        const _request = await fetch('https://discord.com/api/v8/users/@me', { headers: { Authorization: 'Bearer ' + _token } });
        const _user = await _request.json();

        if (_user.message && _user.message === '401: Unauthorized') {
            kill(false, 'Lütfen giriş yapınız!');
        } else {
            const codeList = require('../../database/models/kod-data.js');
            let checkValid = await codeList.findOne({ kod: _code });
            
            if (!checkValid) return kill(false, 'Yazdığınız promosyon kodu geçersizdir!');

            if (parseInt(checkValid.kullanim) === parseInt(checkValid.usage)) { await codeList.deleteOne({ kod: _code }); return kill(false, 'Bu kodun kullanım limiti doldu!'); };
            if (checkValid.users.includes(_user.id)) return kill(false, 'Bu kodu daha önce kullanmışsınız!');

            let $coin = require('../../database/models/coin.js'),
                $history = require('../../database/models/coin-geçmişi.js');

            await $coin.findOneAndUpdate({ userID: _user.id }, { $inc: { amount: checkValid.prize }}, { upsert: true })
            await $history.findOneAndUpdate({ userID: _user.id }, { $push: { gecmis: { count: checkValid.prize, user: '{system}', reason: '{promocode}', Date: Date.now() } }}, { upsert: true});

            await codeList.updateOne({ kod: _code }, {
                $inc: {
                    kullanim: 1
                },
                $push: {
                    users: _user.id
                }
            }, { upsert: true });

            checkValid.kullanim++;
            return kill(true, checkValid);
        };
	});

	return router;
};