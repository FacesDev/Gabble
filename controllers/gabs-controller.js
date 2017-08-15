const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const models = require('../models')
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
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

router.get('/new_gab', (request, response) => {
    if (request.session.isAuthenticated == true) {
        response.render("new_gab");
    } else {
        response.redirect('/');
    }

});
router.post('/new_gab', async (request, response) => {
    var gab = {
        content: request.body.gab,
        author: request.session.user_name,
        userId: request.session.userId
    };
    let result = await models.messages.create(gab);
    response.redirect('/home');
});

router.get('/manage_gabs', async (request, response) => {
    if (request.session.isAuthenticated == true) {
        var result = await models.messages.all({ where: { userId: request.session.userId } });
        var display = request.session.display;
        var model = { result: result, display: display };
        response.render("manage_gabs", model);
    } else {
        response.redirect('/');
    }
});

router.post('/manage_gabs', async (request, response) => {
    var message = request.body.messages;
    var result = await models.messages.create(message);
    response.json(result);
});

router.post('/manage_gabs/:id', async (request, response) => {
    var result = await models.messages.destroy({ where: { id: request.params.id } });
    response.redirect('/manage_gabs');
});

router.post('/manage_gabs/like/:id', async (request, response) => {
    var messageId = request.params.id;
    var userId = request.session.userId;
    var likes = await models.likes.find({ where: { messageId: messageId, userId: userId } });

    if (!likes) {
        var newLike = await models.likes.create({ messageId: messageId, userId: userId });
    }
    response.redirect('/home');
});
router.get('/likes/:id', async (request, response) => {
    if (request.session.isAuthenticated == true) {
        var messageId = request.params.id;
        var message = await models.messages.find({ where: { id: messageId } });
        var likes = await models.likes.findAll({ where: { messageId: messageId }, include: [models.users] });
        var model = { message: message, likes: likes, name: request.session.name };
        response.render('likes', model);
    } else {
        response.redirect('/');
    }
});


module.exports = router;