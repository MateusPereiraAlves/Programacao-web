const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
var path = require('path');
const app = express()


app.use(session({secret: 'sibiuvihaoipsapsp'}));
app.use(bodyParser.urlencoded({extended:true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views1'));

module.exports = app