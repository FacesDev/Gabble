const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const models = require('./models')
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const usersController = require('./controllers/users-controller');
const gabsController = require('./controllers/gabs-controller');

const application = express();

application.engine('mustache', mustache());
application.set('views', './views');
application.set('view engine', 'mustache');
application.use(express.static(__dirname + '/public'));
application.use(bodyParser.urlencoded({ extended: true }));
application.use(cookieParser());
application.use(expressValidator());
application.use(usersController);
application.use(gabsController);
application.use(session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false,
}));

application.set('port', process.env.PORT || 3000)

application.listen(application.get('port'), function () {
    console.log('app starting on port: ', application.get('port'))
});

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT * FROM users;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});