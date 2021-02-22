const express = require('express');
const queue = require('express-queue');
const like = require('./Modules/like_module');
const c = require('./Modules/counter_module');
const AccActions = require('./Modules/account_actions');
const consts = require('./Modules/const');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Port: ${port}`))
app.use(express.static('public'));
app.use(express.json());
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.post('/rating', (request, response) => {
    const url = request.query.url;
    const body = request.body;
    const cookies = body.accdata;

    AccActions.TokenVerify(cookies, request.ip)
    .then(async (_) => {
        console.log(cookies);
        if(!cookies.token){
            response.json({
                status: consts.STATUSES.FAILED, 
                token: cookies.token
            });
            return;
        }

        const userid = cookies.userid;
        const action = body.action;
    
        const obj = await like.CheckEntries(url, userid, action);
    
        return response.json({
            status: consts.STATUSES.SUCCESS,
            actual_action: obj.action,
            likes: obj.likes,
            dislikes: obj.dislikes
        });
    })
    .catch(async (err) => { 
        return response.json({
            status: consts.STATUSES.FAILED,
            err: err
        });
    });
});

app.get('/rating', async (request, response) => {
    const url = request.query.url;
    const counter = await new c.Counter(url).values;

    response.json({
        status: consts.STATUSES.SUCCESS,
        likes: counter.likes ,
        dislikes: counter.dislikes 
    });
});

app.post('/registration', async (request, response) => {
    const data = request.body;
    const username = data._username;
    const firstname = data._firstname;
    const email = data._email;
    const password = data._password; 
    const ip = request.ip;

    AccActions.Register(username, firstname, email, password, ip)
    .then((accdata) => {
        response.json({
            status: consts.STATUSES.SUCCESS,
            data: {userid: accdata.userid, ltt: accdata.ltt}, 
            token: accdata.token
        });
    })
    .catch((err) => {
        return response.json({
            status: consts.STATUSES.FAILED,
            msg: {message: err.message, code: err.code}
        })
    });
});

app.post('/login', async (request, response) => {
    const data = request.body;
    const action = (data._action=='email') ? (true) : (false);
    const entry = data._username || data._email;
    const password = data._password; 
    const ip = request.ip;

    AccActions.Login(entry, action, password, ip)
    .then((accdata) => {
        console.log(1);
        response.json({
            status: consts.STATUSES.SUCCESS, 
            data: {userid: accdata.userid, ltt: accdata.ltt}, 
            token: accdata.token
        });
        return;
    })
    .catch((err) => {
        response.json({
            status: consts.STATUSES.FAILED,
            msg: {code: err.code, message: err.message}
        });
        return;
    });
});
