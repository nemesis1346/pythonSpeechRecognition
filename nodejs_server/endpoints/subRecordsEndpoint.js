"use strict";
const DataModel = require("../models/dataModel.js");
const databaseApi = require('../api/databaseApi');

async function getSubRecordsById(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Get Subrecord in SpeechEndpoint: ");
    console.log(request.uuid);
    let uuid = request.uuid;
    try {
        let finalList = await databaseApi.getAllSubrecordsByRecordId(uuid);
        console.log('SPEECHES IN FILES ENDPOINT')
        console.log(finalList)
        dataModel.status = 200;
        dataModel.data = finalList;
        return dataModel;
    } catch (error) {
        console.error(error);
    }

}
module.exports.getSubRecordsById = getSubRecordsById;
