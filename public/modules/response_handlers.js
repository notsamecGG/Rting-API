function HandleResponse(display, response_data) {
    if(!response_data){
        display.textContent = 'Bad connection, please try again later';
        return;
    }
    const status = response_data.status;
    console.log(response_data);
    
    if(status == 0) {
        console.error(response_data.msg)
        display.textContent = response_data.msg.message;
    }

    if(status == 1){
        display.textContent = '';
        var data = { type: "FROM_PAGE", data: {userid: response_data.data.userid, ltt: response_data.data.ltt, token: response_data.token} };
        window.postMessage(data, "*");
        window.location.href = '../success/';
    }
}

export {HandleResponse};