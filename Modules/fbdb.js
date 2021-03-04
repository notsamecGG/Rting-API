const firebase = require('firebase/app');
const admin = require('firebase-admin');
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
        this.database = this.root.collection(path);
    }

    Get = async (id) => {
        const doc = await this.database.doc(id).get();
        if(!doc)
            throw new Error(`FBDB: Get not found; id: {${id}}`);
        return { data: doc.data() };
    }

    GetChild = async (collection, id, childid) => {
        const doc = await this.database.doc(collection).collection(id).doc(childid).get();
        if(!doc)
            throw new Error(`FBDB: Get not found; id: {${id}}`);
        return { data: doc.data() };
    }

    Find = async (id, value) => {
        const doc = (await this.database.where(id, '==', value).get()).docs[0];
        if(!doc)
            throw new Error(`FBDB: Not found; id: {${id}}, value: {${value}}`);
        return { id: doc.id, data: doc.data() };
    }

    FindChild = async (collection='rating', id, childid) => {
        const doc = await (await this.database.doc(`${collection}/${id}/${childid}`)).get();
        if(!doc)
            throw new Error('FBDB: Child not fount');
        return { data: doc.data() };
    }

    Check = async (id, value) => {
        const doc = (await this.database.where(id, '==', value).get()).docs[0];
        return (doc) ? true : false;
    }

    Add = async (data) => {
        return (await this.database.add(data)).id;
    }

    Set = async (id, data) => {
        this.database.doc(id).set(data);
        return data;
    }

    SetPath = async (collection='rating', id, childid, data) => {
        this.database.doc(`${collection}/${id}/${childid}`).set(data);
        return data;
    }

    Update = async (id, update) => {
        this.database.doc(id).update(update);
    }

    UpdateChild = async (collection='rating', id, childid, update) => {
        this.database.doc(`${collection}/${id}/${childid}`).update(update);
    }

    UpdateIPs = async (accid, ip) => {
        (await (await this.database.doc(accid).get()).where('_ips', 'array-contains', ip).get()).docs[0].update({
            _ips: admin.firestore.FieldValue.arrayUnion(ip)
        });
    }

    InitDB = async () => {
        await _defaultInit();
        return await firebase.firestore();
    }
    
    Init = async (path) => {
        await _defaultInit();
        return await firebase.firestore().collection(path);
    }
}

module.exports = { Database };
