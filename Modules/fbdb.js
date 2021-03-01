const firebase = require('firebase/app');
require('firebase/database');
require('dotenv').config();

module.exports = { InitDB, Init };

function _defaultInit() {
    const config = { 
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        // measurementId: process.env.MEASUREMENT_ID //optional
    };

    firebase.initializeApp(config);
}

async function InitDB() {
    await _defaultInit();
    return await firebase.database();
}

async function Init(path){
    await _defaultInit();
    return await firebase.database().ref();
}
