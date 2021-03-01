//ltt - Long term token
const Firebase = require('./fbdb');
const TokenGenerator = require('uuid-token-generator');
const consts = require('./const');

const database = Firebase.Init(`Accounts/`);
const tokgen = new TokenGenerator();

module.exports = { Register: Register, Login: Login, TokenVerify: TokenVerify }

async function Register(username, firstname, email, password, ip) {
    if(await CheckMail(email)){
        throw consts.ERRORS.EMAIL_USED;
    } else if (await CheckUsername(username)){
        throw consts.ERRORS.USERNAME_USED;
    } else {
        const token = tokgen.generate();
        const ltt = new TokenGenerator(256).generate();
        await database.push({
            _username: username, 
            _firstname: firstname, 
            _email: email,
            _password: password, 
            _token: token,
            _ltt: ltt,
            _ips: [ip]});
        console.log(await Login(username, false, password, ip));
        return await Login(username, false, password, ip);
    }
}

async function CheckMail(email) {
    let result = await database.orderByChild('_email').equalTo(email).get();
    return result.exists() ? true : false;
}

async function CheckUsername(username) {
    let result = await database.orderByChild('_username').equalTo(username).get();
    return result.exists() ? true : false;
}

async function Login(entry, action, password, ip){
    var acc = (action) 
    ? (await database.orderByChild('_email').equalTo(entry)) 
    : (await database.orderByChild('_username').equalTo(entry));
    if(acc && password == acc._password){
        if(!acc._ips.includes(ip)) {
            //verify
            database.child(acc._id).push({_ips: ip});
        }
        return {userid: acc._id, token: acc._token, ltt: acc._ltt};
    } else {
        throw consts.ERRORS.BAD_ENTRY;
    }
}

async function TokenVerify(data, ip) {
    var userid = data.userid;
    var token = data.token;
    var finalmessage = {};
    if(userid) {
        if(!token) {
            token = GenerateToken(userid, data.longTermToken);
            finalmessage.token = token;
        }
        /*if(!token) {
            throw consts.ERRORS.BAD_ENTRY;
        }*/
    } else {
        throw consts.ERRORS.DATA_NOT_AVIABLE;
    }

    var acc = await database.child(userid).get().val();
    if(acc){
        if(!acc._ips.includes(ip)) {
            //verify
            database.child(acc._id).push({_ips: ip});
        }
        if(acc._token == token){
            return finalmessage;
        }
    } else {
        throw consts.ERRORS.BAD_ENTRY;
    }
}

async function GenerateToken(userid, longTermToken) {
    var acc = await database.chilf(userid).get().val();
    if(acc._ltt == longTermToken) {
        const token = tokgen.generate();
        UpdateToken(userid, token);
        return token;
    }

    return;
}

async function UpdateToken(userid, token) {
    database.child(userid).update({_token: token});
}

//pass token from register and login
