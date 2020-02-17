"use strict";
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
// const Sequelize = require('sequelize');

//This must be deleted
class DatabaseApi {
    constructor() {
        console.log('DATABASE API INSTANCE')
        console.log(process.env.DB_ENGINE);
        // const sequelize = new Sequelize(
        //     process.env.DB_NAME,
        //     process.env.DB_USERNAME,
        //     process.env.DB_PASSWORD, {
        //     host: process.env.DB_HOSTNAME,
        //     dialect: process.env.DB_ENGINE
        // });
    }

    async init() { }

    /**
     * @description It creates a new object for storing linguistics project
     * @return {Promise} A promise that creates a object for storing linguistics project
     * @param object is the model for the object
     */
    async saveSpeechFile(fileModel) {
        let dataModel = new DataModel(null, null, null);
        console.log("************************************");
        console.log("Request Save Object: ");
        console.log(fileModel);

        try {


        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

}
module.exports = DatabaseApi;
