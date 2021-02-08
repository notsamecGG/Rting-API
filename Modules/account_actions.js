const { copyFileSync } = require('fs');
const Datastore = require('nedb-async');

const database = new Datastore.AsyncNedb(`Accounts/all_data.db`);
database.loadDatabase();

exports.Register = async function(username, firstname, email, password, ip) {
    if(await CheckMail(email)){
        return {status: 'failed', message: 'Email is already used'};
    } else if (await CheckUsername(username)){
        return {status: 'failed', message: 'Username is already used'};
    } else {
        await database.asyncInsert({
            _username: username, 
            _firstname: firstname, 
            _email: email,
            _password: password, 
            _ips: [ip]});
        return {status: 'success', message: ''};
    }
}

async function CheckMail(email) {
    let result = await database.asyncFind({_email: email});
    result = result[0];
    if (result) return true;
    else return false;
}

async function CheckUsername(username) {
    let result = await database.asyncFind({_username: username});
    result = result[0];
    if (result) return true;
    else return false;
}

exports.Login = async function(entry, action, password, ip){
    var account = (action) 
    ? (await database.asyncFindOne({_email: entry})) 
    : (await database.asyncFindOne({_username: entry}));
    if(account && password == account._password){
        if(!account._ips.includes(ip)) {
            //verify
            database.asyncUpdate({_id: account._id}, { $push: {_ips: ip}}, {});
        }
        return {status: 'success', message: account._id};
    }
}
