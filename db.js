const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const ArticleModel = mongoose.model('Article', articleSchema);

module.exports.ArticleModel = ArticleModel;