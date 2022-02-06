const router = require('express').Router();
const config = require('../../config.js');
const blog = require('../../database/models/blog.js');

module.exports = (client) => {
    router.get('/blog/list/:page', async (req, res) => {
        let page = req.params.page;
        if (!page) page = 1;

        if (isNaN(page)) return res.json({
            success: false,
            message: "404: Not Found"
        });

        if (parseInt(page) < 1) return res.json({
            success: false,
            message: "404: Not Found"
        });

        let fetched = await blog.find();

        res.json(
            fetched.slice((parseInt(page) - 1) * 6, parseInt(page) * 6).map(item => {
                let author = client.users.cache.get(item.author);
                let formattedDate = require('moment')(parseInt(item.date)).format('HH:mm DD.MM.YYYY');
                
                return {
                    author: {
                        img: author.avatarURL({ dynamic: true }),
                        username: author.tag
                    },
                    id: item.date,
                    img: item.image,
                    date: formattedDate,
                    title: item.title,
                    text: item.text
                };
            })
        );
    });

    router.get('/blog/fetch/:id', async (req, res) => {
        let id = req.params.id;
        let item = await blog.findOne({ date: id });
        if (!item) return res.json({});

        let author = client.users.cache.get(item.author);
        let formattedDate = require('moment')(parseInt(item.date)).format('HH:mm DD.MM.YYYY');

        res.json({
            author: {
                img: author.avatarURL({ dynamic: true }),
                username: author.tag
            },
            id: item.date,
            img: item.image,
            date: formattedDate,
            title: item.title,
            text: item.text
        });
    });

	return router;
};