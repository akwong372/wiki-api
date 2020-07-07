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

// requests for all articles

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

// requests for individual articles

app.route('/articles/:article').get((req, res) => {
    const title = req.params.article;
    db.ArticleModel.findOne({ title }, (err, article) => {
        if (err) {
            console.log(`Error finding article: ${err}`);
            res.redirect('/articles');
        } else if (article) {
            console.log('Article found');
            res.json(article);
        } else {
            res.json('No articles with that title.');
        }
    });
})
    .put((req, res) => {
        const title = req.params.article;
        const newTitle = req.body.title;
        const newContent = req.body.content;
        db.ArticleModel.updateOne({ title }, { title: newTitle, content: newContent }, err => {
            if (err) {
                console.log(`Error replacing article: ${err}`);
                res.redirect(`/articles/${title}`);
            } else {
                console.log(`Article ${title} replaced`);
                res.redirect(`/articles/${newTitle}`);
            }
        })
    })
    .patch((req, res) => {
        const title = req.params.article;
        const patchData = req.body;

        db.ArticleModel.findOneAndUpdate({ title }, { $set: patchData }, { new: true }, (err, article) => {
            if (err) {
                console.log(`Error updating article: ${err}`);
                res.redirect(`/articles/${title}`);
            } else {
                console.log(`Article ${title} updated ${JSON.stringify(article)}`);
                res.redirect(`/articles/${article.title}`);
            }
        })
    })
    .delete((req, res) => {
        const title = req.params.article;
        db.ArticleModel.deleteOne({ title }, err => {
            if (err) {
                console.log(`Error deleting article: ${err}`);
                res.redirect(`/articles/${title}`);
            } else {
                console.log(`Deleted article: ${title}`);
                res.redirect('/articles');
            }
        })
    });

app.listen(port, () => console.log(`Listening on port ${port}`));