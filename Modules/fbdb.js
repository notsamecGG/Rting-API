const firebase = require('firebase');
require('dotenv').config();

module.exports = { InitDB, Init };

async function InitDB() {
    await firebase.initializeApp({ 
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID
    });

    return await firebase.database();
}

async function Init(path) {
    return InitDB().ref(path);
}
