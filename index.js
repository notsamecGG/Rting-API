const express = require('express');
const queue = require('express-queue');
const like = require('./Modules/like_module');
const c = require('./Modules/counter_module');
const AccActions = require('./Modules/account_actions');
const { response, request } = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Port: ${port}`))
app.use(express.static('public'));
app.use(express.json());
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.post('/:url/rating', async (request, response) => {
    const data = request.body;
    const url = request.params.url;
    const userid = data.user;
    const action = data.action;

    const obj = await like.CheckEntries(url, userid, action);

    response.json({
        status: 'succes',
        actual_action: obj.action,
        likes: obj.likes,
        dislikes: obj.dislikes
    });
});

app.get('/:url/rating', async (request, response) => {
    const url = request.params.url;
    const counter = await new counter.Counter(url)._getValues();

    response.json({
        status: 'succes',
        likes: counter.likes ,
        dislikes: counter.dislikes 
    });
});

app.post('/register', async (request, response) => {
    const data = request.body;
    const username = data._username;
    const firstname = data._firstname;
    const email = data._email;
    const password = data._password; 
    const ip = request.ip;

    const obj = await AccActions.Register(username, firstname, email, password, ip)

    response.json({
        status: 'succes',
        actual_action: obj.action,
        likes: obj.likes,
        dislikes: obj.dislikes
    });
});

app.post('/login', async (request, response) => {
    const data = request.body;
    const action = (data._action=='email') ? (true) : (false);
    const entry = data._username || data._email;
    const password = data._password; 
    const ip = request.ip;

    const obj = await AccActions.Login(entry, action, password, ip);

    response.json(obj);
});