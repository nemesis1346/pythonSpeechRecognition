"use strict";
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
const DatabaseApi = require('../api/databaseApi');
const convertRecordEndpoint = require('../endpoints/convertRecordEndpoint');

async function convertAllRecords(audioDirectory) {
  let dataModel = new DataModel(null, null, null);
  console.log("************************************");
  console.log("Request Convert All Records in ConversionEndpoint: ");
  console.log(audioDirectory)
  try {
    const records = await fs.promises.readdir(audioDirectory);
    let transcriptions = [];
    for (const record_id of records) {
      let record_folder = audioDirectory + "/" + record_id;
      let currentTranscription = await convertRecordEndpoint.mainAlgorithm(record_id, record_folder);
      transcriptions.push(currentTranscription);
    }
    console.log('FINISHED CRON JOBS')
    dataModel.status = 200;
    dataModel.data = transcriptions;
    dataModel.message = "convertion attempt successful"
    return dataModel;
  } catch (error) {
    console.error(error);
  }
}

module.exports.convertAllRecords = convertAllRecords;
