import {URL} from '../modules/public_const.js';
import {HandleResponse} from '../modules/response_handlers.js';
const display = document.getElementById('error_display');

document.getElementById('submit').addEventListener('click', ButtonCallbackX);

function ButtonCallbackX(){
    Promise.all([
        ElementById("username"),
        ElementById("firstname"), 
        ElementById("email"),
        ElementById("password"),
        ElementById("confirm")
    ]).then(async values => {
        const username = values[0];
        const firstname = values[1];
        const email = values[2];
        const password = values[3];
        const confirm = values[4];

        let data = {_username: username, _firstname: firstname, _email: email, _password: password, _confirm: confirm};
        await CheckAll(data).then(() => Register(data)).catch((err) => display.textContent = err);
    }).catch( err => {
        display.textContent = err.message;
    });
}

async function ElementById(id) {
    const value = document.getElementById(id).value;
    if(value <= 2) {
        throw new Error(`${id} must be filled`);
    } else {
        return value;
    }
}

async function CheckAll(data){
    if(data._password.length > 5 && password.length < 256){
        throw new Error('Password must be 1 - 256 characters long');
    }

    if(data._password != data._confirm){
        throw new Error('Passwords doesnt match');
    }

    if(!data._email.includes('@')){
        throw new Error('Email must contain @');
    }

    return;
}

async function Register(data){
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(`${URL}registration`, options);
    const r_data = await response.json();

    HandleResponse(display, r_data);
}