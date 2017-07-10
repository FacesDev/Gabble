
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



// router.get('/likes', (request, response) => {

//     var result = await models.likes.all();
//     response.render("likes");
// });
// router.post('/likes', async (request, response) => {
//     var like =
//     {
//         userId: request.body.userId, 
//         messageId: request.body.messageId
//     }

//     var result = await models.like.create(like)
//     response.json(result);
// });







module.exports = router;