"use strict";
const DataModel = require("../models/dataModel.js");

async function verifyServer(object) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Verify Server in Session Endpoint: ");
    console.log(object);
    try {

        dataModel.message = "service is up and running";
        dataModel.status = 200;
        dataModel.data = JSON.stringify("service is up and running");
        return dataModel;
    } catch (error) {
        console.error(error);
        dataModel.message = "service is not available";
        dataModel.status = 300;
        dataModel.data = JSON.stringify("service is not available");
    }
}

module.exports.verifyServer = verifyServer;
;
