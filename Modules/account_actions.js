//ltt - Long term token
const Datastore = require('./fbdb');
const TokenGenerator = require('uuid-token-generator');
const consts = require('./const');

const database = new Datastore.Database(`accounts`);
const tokgen = new TokenGenerator();

module.exports = { Register, Login, TokenVerify }

async function Register(username, firstname, email, password, ip) {
    console.log('register begin');
    if(await CheckMail(email)){
        throw consts.ERRORS.EMAIL_USED;
    } else if (await CheckUsername(username)){
        throw consts.ERRORS.USERNAME_USED;
    } else {
        const token = tokgen.generate();
        const ltt = new TokenGenerator(256).generate();
        await database.Add({
            _username: username, 
            _firstname: firstname, 
            _email: email,
            _password: password, 
            _token: token,
            _ltt: ltt,
            _ips: [ip]});
        return await Login(username, false, password, ip);
    }
}

async function CheckMail(email) {
    return await database.Check('_email', email);
}

async function CheckUsername(username) {
    return await database.Check('_username', username);
}

async function Login(entry, action, password, ip){
    const {id, data} = (action) 
    ? ((await database.Find('_email', entry))) 
    : ((await database.Find('_username', entry)));
    if(data && password == data._password){
        // database.UpdateIPs(id, ip);
        return {userid: id, token: data._token, ltt: data._ltt};
    } else {
        throw consts.ERRORS.BAD_ENTRY;
    }
}

async function TokenVerify(data, ip) {
    var {userid, token} = data;
    var finalmessage = {};
    if(userid) {
        if(!token) {
            token = GenerateToken(userid, data.longTermToken);
            finalmessage.token = token;
        }
    } else {
        throw consts.ERRORS.DATA_NOT_AVIABLE;
    }

    var acc = (await database.Get(userid)).data;
    if(acc){
        // database.UpdateIPs(userid, ip);
        if(acc._token == token){
            return finalmessage;
        }
    } else {
        throw consts.ERRORS.BAD_ENTRY;
    }
}

async function GenerateToken(userid, longTermToken) {
    var acc = (await database.Get(userid)).data;
    if(acc._ltt == longTermToken) {
        const token = tokgen.generate();
        UpdateToken(userid, token);
        return token;
    }

    return;
}

async function UpdateToken(userid, token) {
    database.Update(id, {_token: token});
}

//pass token from register and login
