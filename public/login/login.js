import {URL} from '../modules/public_const.js';
import {HandleResponse} from '../modules/response_handlers.js';
const display = document.getElementById('error_display');

document.getElementById('submit').addEventListener('click', ButtonCallback);

async function ButtonCallback(){
    const entry = document.getElementById("entry").value;
    const password = document.getElementById("password").value;

    let data = {_password: password};
    if(entry.includes('@')){
        data._action = 'email';
        data._email = entry;
    } else {
        data._action = 'username';
        data._username = entry;
    }
    Login(data);
}

async function Login(data){
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(`${URL}login`, options);
    const r_data = await response.json();

    HandleResponse(display, r_data, window);
}