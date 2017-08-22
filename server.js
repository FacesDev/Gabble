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