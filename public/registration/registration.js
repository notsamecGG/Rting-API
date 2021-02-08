async function ButtonCallback(){
    this.isOk = true;
    const username = ElementById("username");
    const firstname = ElementById("firstname");
    const email = ElementById("email");
    const password = ElementById("password");
    const confirm = ElementById("confirm");

    if(isOk) {
        let data = {_username: username, _firstname: firstname, _email: email, _password: password, _confirm: confirm};
        let check_result = await CheckAll(data);
        if (check_result.status == 0){
            Register(data);
        }
    }
}

ElementById = (id) => {
    const value = document.getElementById(id).value;
    if(value <= 2) {
        console.log(new Error(`${id} must be filled`));
        this.isOk = false;
    } else {
        return value;
    }
}

function CheckAll(data){
    var result = {status: 0, message: 'Success'};
    if(data._password.length > 5 && password.length < 256){
        result.status = 1;
        result.message = 'Password must be 1 - 256 characters long';
    }

    if(data._password != data._confirm){
        result.status = 2;
        result.message = 'Passwords doesnt match';
    }

    if(!data._email.includes('@')){
        result.status = 3;
        result.message = 'Email must contain @';
    }

    console.log(result.message);
    return result;
}

async function Register(data){
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(`http://localhost:5501/register`, options);
    const r_data = await response.json();

    console.log(r_data);
}