const express           = require('express');
const mysql             = require('mysql');
const bodyParser        = require('body-parser');
const db                = require('./config/db');

const app = express();

const port = 3002;

app.use(bodyParser.urlencoded({extended:true}));

// MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
    // if(err) return console.log(err);

    // let db = database.db('yenisabah');
    require('./app/routes')(app, db);

    app.listen(port, () => {
        console.log('we are live on '+port);
    })
// });