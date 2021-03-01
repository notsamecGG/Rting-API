const firebase = require('firebase/app');
require('firebase/database');
require('dotenv').config();

module.exports = { InitDB, Init };

function _defaultInit() {
    const config = { 
        apiKey: "AIzaSyCcXAQeilIUudQfYBYK9EQsPtj3FcqFhU8",
        authDomain: "rting-db.firebaseapp.com",
        databaseURL: "https://rting-db-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "rting-db",
        storageBucket: "rting-db.appspot.com",
        messagingSenderId: "605006049438",
        appId: "1:605006049438:web:c13e00a67c33d36e3e0b8f",
        
        // apiKey: process.env.API_KEY,
        // authDomain: process.env.AUTH_DOMAIN,
        // projectId: process.env.PROJECT_ID,
        // storageBucket: process.env.STORAGE_BUCKET,
        // messagingSenderId: process.env.MESSAGING_SENDER_ID,
        // appId: process.env.APP_ID,
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
