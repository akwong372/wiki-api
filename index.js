const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('home page');
});

app.route('/articles').get((req, res) => {
    db.ArticleModel.find((err, articles) => {
        if (err) {
            console.log(`Failed to get articles: ${err}`);
            res.send('error getting');
        } else {
            console.log('Found all articles')
            res.json(articles);
        }
    });
})
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new db.ArticleModel({
            title,
            content
        });
        newArticle.save((err) => {
            if (err) {
                console.log(`Error saving new article: ${err}`);
                res.redirect('/articles');
            } else {
                console.log(`Created article: ${title}`)
                res.redirect('/articles');
            }
        });
    })
    .delete((req, res) => {
        db.ArticleModel.deleteMany(err => {
            if (err) {
                console.log(`Error deleting articles: ${err}`);
                res.redirect('/articles');
            } else {
                console.log('Deleted all articles')
                res.redirect('/articles');
            }
        });
    });

app.listen(port, () => console.log(`Listening on port ${port}`));