const firebase = require('firebase/app');
const { copyFileSync } = require('fs');
require('firebase/firestore');
require('dotenv').config();

function _defaultInit() {
    const config = { 
        apiKey: "AIzaSyCcXAQeilIUudQfYBYK9EQsPtj3FcqFhU8",
        authDomain: "rting-db.firebaseapp.com",
        databaseURL: "https://rting-db-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "rting-db",
        storageBucket: "rting-db.appspot.com",
        messagingSenderId: "605006049438",
        appId: "1:605006049438:web:c13e00a67c33d36e3e0b8f",
    };

    if (firebase.apps.length === 0) {
        firebase.initializeApp(config);
    }
}

class Database {
    constructor(path) {
        _defaultInit();
        this.root = firebase.firestore();
        this.root.settings({ timestampsInSnapshots: true });
        this.database = this.root.collection(path);
    }

    FindOne = async function(id, value){
        const doc = (await this.database.where(id, '==', value).get()).docs[0];
        if(!doc)
            throw new Error(`FBDB: Not found; id: {${id}}, value: {${value}}`)
        return {id: doc.id, data: doc.data()};
    }

    Check = async function(id, value){
        const doc = (await this.database.where(id, '==', value).get()).docs[0];
        return (doc) ? true : false;
    }

    Add = async function(data){
        this.database.add(data);
    }

    InitDB = async function(){
        await _defaultInit();
        return await firebase.firestore();
    }
    
    Init = async function(path){
        await _defaultInit();
        return await firebase.firestore().collection(path);
    }
}

module.exports = { Database };
