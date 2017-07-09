const express = require('express');
const router = express.Router();


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
        userId: request.body.userId
    };

    let result = await models.messages.create(gab);

    response.redirect('/home');
});

router.get('/manage_gabs', async (request, response) => {
    console.log("one");
    if (request.session.isAuthenticated == true) {
        var result = await models.messages.all({ where: { author: request.session.user_name } });
        var display = request.session.display;
        var model = { result: result, display: display };
        response.render("manage_gabs", model);
    } else {
        response.redirect('/');
    }
});

router.post('/manage_gabs', async (request, response) => {
    var gab = request.body.messages;
    var result = await models.messages.create(gab);
    response.json(result);
});

// router.put('/manage_gabs/:id', async (request, response) => {
//     console.log('three');
//     var result = await models.messages.update(message, { where: { id: request.params.id } });
//     console.log("put: ", request.params.id)
//     response.json(result);
// });

router.post('/manage_gabs/:id', async (request, response) => {
    var result = await models.messages.destroy({ where: { id: request.params.id } });
    response.redirect('/manage_gabs');
    // response.json(result);
});



// application.get('/messages', async (request, response) => {
//     var result = await models.messages.all({
//         include: [models.likes, models.users]
//     });
//     response.json(result);
// });
// application.post('/messages', async (request, response) => {
//     var message = await request.body.messages;
//     models.message.create(message)
//     response.render('home', result);
// });
// application.put('/messages/:id', async (request, response) => {
//     var message = request.body.messages;
//     var result = await models.Message.update(message, { where: { id: request.params.id } });
//     response.json(result);
// });
// application.delete('/messages/:id', async (request, response) => {
//     var result = await models.Message.destroy({ where: { id: request.params.id } });
//     response.json(result);


// });
module.exports = router;