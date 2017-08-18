const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const models = require('../models')
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const router = express.Router();
router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(expressValidator());

router.use(session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false,
}));

function hashPassword(password) {
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    return hash
};

router.get('/', async (request, response) => {
    response.render("login");
});

router.post('/', async (request, response) => {
    request.checkBody('username', 'No Username Provided. ').notEmpty();
    request.checkBody('username', 'Must be less than 100 characters. ').matches(/^.{0,100}$/, "i");
    request.checkBody('password', 'No password was provided.  ').notEmpty();
    request.checkBody('password', "Password must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    var errors = request.validationErrors();
    if (errors) {
        var model = { errors: errors };
        request.session.isAuthenticated = false;
        response.render('login', model);
    } else {
        var user = await models.users.findOne({
            where: {
                username: request.body.username,
                password: hashPassword(request.body.password)
            }
        })
        if (!user) {
            request.session.isAuthenticated = false;
            response.render("login");

        } else {
            request.session.user_name = request.body.username;
            request.session.password = hashPassword(request.body.password);
            request.session.display = user.display;
            request.session.userId = user.id
            request.session.isAuthenticated = true;
            response.redirect('/home');
        }
    }
});

router.get('/signup', (request, response) => {
    response.render('signup');
});
router.post('/signup', (request, response) => {
    request.checkBody('username', 'No Username Provided. ').notEmpty();
    request.checkBody('username', 'Must be less than 100 characters. ').matches(/^.{0,100}$/, "i");
    request.checkBody('password', 'No password was provided.  ').notEmpty();
    request.checkBody('password', "Password must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    request.checkBody('confirm', 'No confirmation was provided.  ').notEmpty();
    request.checkBody('confirm', "Confirmation must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    var errors = request.validationErrors();
    var model = { errors: errors, display: display };
    if (errors) {
        response.render('signup', model);
    }
    else {
        var user = {
            username: request.body.username,
            password: hashPassword(request.body.password),
            display: request.body.display
        };
        request.session.user_name = request.body.username;
        request.session.display = request.body.display;
        request.session.userId = user.id;
        request.session.isAuthenticated = true;
        var display = request.session.display;
        models.users.create(user);
        response.redirect('home');
    }
});
router.get('/home', async (request, response) => {
    if (request.session.isAuthenticated == true) {
        var result = await models.messages.all({
             order: [['createdAt', 'DESC']],
            include: [models.users, models.likes]
        });
        var display = request.session.display;
        var model = { result: result, display: display };
        response.render("home", model);
    } else {
        response.redirect('/');
    }
});
router.post('/home', (request, response) => {
    response.render("home");
});
router.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
});


module.exports = router;