const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('ok');
});

app.listen(port, () => console.log(`Listening on port ${port}`));