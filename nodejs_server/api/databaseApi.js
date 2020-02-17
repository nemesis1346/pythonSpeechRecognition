"use strict";
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
const User = require('../models/user');
const Speech = require('../models/speech');

//This must be deleted
class DatabaseApi {
    constructor() {
        console.log('DATABASE API INSTANCE')
    }

    async init() { }

    async saveUser(userObject) {
        console.log("************************************");
        console.log("Request Save Object: ");
        console.log(userObject);
        try {
            await User.create({ 
                username: userObject.username, 
                email: userObject.email });
        } catch (err) {
            console.log(err);
            throw new Error(error);
        }

    }

    async saveSpeech(speechObject) {
        console.log("************************************");
        console.log("Request Save Speech: ");
        console.log(speechObject);
        try {
            await Speech.create({ 
                uuid: speechObject.uuid,
                userId: speechObject.username, 
             });

        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

}
module.exports = DatabaseApi;
