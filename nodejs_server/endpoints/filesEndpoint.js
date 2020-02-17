"use strict";
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
const UUID = require('uuid/v1');
const databaseApi = require('../api/databaseApi');

//This must be deleted
class FilesEndpoint {
  constructor() {
    this.databaseApi = new databaseApi();
  }

  async init() { }

  async processingFiles(files) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Processing Files in FilesEndpoint: ");
    console.log(files);
    let uuid = UUID();
    try {
     
      fs.writeFile('../../audio_files/'+uuid+".wav", files.wavFile.data, (err) => {
        if (err) {
          console.log('Error: ', err);
        } else {
          console.log('FileSaved')
          //now we have to save the record in the database
          var speechObject = {
            uuid: UUID(),
            userId:1 //this is testing
        };
          this.databaseApi.saveSpeech(speechObject);
          dataModel.status=200;
          dataModel.message="Saved Successfuly";
          return dataModel;
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

}
module.exports = FilesEndpoint;
