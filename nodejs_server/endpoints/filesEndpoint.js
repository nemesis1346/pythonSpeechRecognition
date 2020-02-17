"use strict";
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
const UUID = require('uuid/v1');

//This must be deleted
class FilesEndpoint {
  constructor() {

  }

  /**
   * @description Initalizes the Hyperstate Network by making a connection to the Composer runtime. Could be for ping?
   * @return {Promise} A promise whose fullfillment means the initialization has completed
   */
  async init() { }

  /**
   * @description It creates a new object for storing linguistics project
   * @return {Promise} A promise that creates a object for storing linguistics project
   * @param object is the model for the object
   */
  async saveObject(requestObject) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Save Object: ");
    console.log(requestObject);

    try {

      dataModel.data = "Object " + objectModel.objectId + " saved successfully";
      dataModel.status = "200";
      return dataModel;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

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
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

}
module.exports = FilesEndpoint;
