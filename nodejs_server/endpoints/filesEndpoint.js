"use strict";
const ObjectModel = require("../models/objectModel.js");
const DataModel = require("../models/dataModel.js");

const firebase = require("../firebaseSetup/firebaseConfig.js");
//This must be deleted
class VocabularyFirepoint {
  constructor() {
    this.database = firebase.database();
    this.storage = firebase.storage();
  }

  /**
   * @description Initalizes the Hyperstate Network by making a connection to the Composer runtime. Could be for ping?
   * @return {Promise} A promise whose fullfillment means the initialization has completed
   */
  async init() {}

  async getObjectQuery(requestObjectQuery) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Save Object: ");
    console.log(requestObjectQuery);
    try {
      let input = requestObjectQuery.input;
      let resultList = [];

      //We do this for mediaLengua Content
      const snapshotMediaLengua = await this.database
        .ref("objectModel/")
        .orderByChild("mediaLenguaContent")
        .once("value");
      let responseListMediaLengua = snapshotMediaLengua.val();
      for (var i in responseListMediaLengua) {
        if (responseListMediaLengua[i].mediaLenguaContent.includes(input)) {
          resultList.push(responseListMediaLengua[i]);
        }
      }
      //We do this for Spanish
      const snapshotSpanish = await this.database
        .ref("objectModel/")
        .orderByChild("spanishContent")
        .once("value");
      let responseListSpanish = snapshotSpanish.val();
      for (var i in responseListSpanish) {
        if (responseListSpanish[i].spanishContent.includes(input)) {
          resultList.push(responseListSpanish[i]);
        }
      }
      //We do this for kichwa content
      const snapshotKichwa = await this.database
        .ref("objectModel/")
        .orderByChild("kichwaContent")
        .once("value");
      let responseListKichwa = snapshotKichwa.val();
      for (var i in responseListKichwa) {
        if (responseListKichwa[i].kichwaContent.includes(input)) {
          resultList.push(responseListKichwa[i]);
        }
      }
      //We do this for Elicit Sentence
      const snapshotElicitSentence = await this.database
        .ref("objectModel/")
        .orderByChild("elicitSentenceContent")
        .once("value");
      let responseListElicitSentence = snapshotElicitSentence.val();
      for (var i in responseListElicitSentence) {
        if (
          responseListElicitSentence[i].elicitSentenceContent.includes(input)
        ) {
          resultList.push(responseListElicitSentence[i]);
        }
      }
      //We do this for Ipa
      const snapshotIpa = await this.database
        .ref("objectModel/")
        .orderByChild("ipaContent")
        .once("value");
      let responseListIpa = snapshotIpa.val();
      for (var i in responseListIpa) {
        if (responseListIpa[i].ipaContent.includes(input)) {
          resultList.push(responseListIpa[i]);
        }
      }
      console.log('PRE FILTERED');
      console.log(resultList);

      let filteredResult = this.removeDuplicates2(resultList,'objectId');

      console.log('FILTERED');
      console.log(filteredResult);
      dataModel.data = JSON.stringify(filteredResult);
      dataModel.status = "200";
      return dataModel;
    } catch (error) {
      console.log(error);
    }
  }

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

  //  MORE EFFICIENT, BUT LESS FUN
  /**
   * @description Remove duplicates from an array of objects in javascript
   * @param arr - Array of objects
   * @param prop - Property of each object to compare
   * @returns {Array}
   */
  removeDuplicatesProp(arr, prop) {
    let obj = {};
    return Object.keys(
      arr.reduce((prev, next) => {
        if (!obj[next[prop]]) obj[next[prop]] = next;
        return obj;
      }, obj)
    ).map(i => obj[i]);
  }

  parseContent(content) {
    // console.log(content);
    let entireContent = content;
    let finalResult = [];

    //Processing for the entire sentence
    for (let index = 0; index <= entireContent.length; index++) {
      for (let j = index; j <= entireContent.length; j++) {
        const currentResult = entireContent.slice(index, j).trim();
        if (currentResult) {
          finalResult.push(currentResult.toLowerCase());
        }
      }
    }
    finalResult = this.removeDuplicates(finalResult);
    return finalResult;
  }
  /**
   * @description Remove duplicates
   */
  removeDuplicates(arr) {
    let unique_array = [];
    for (let i = 0; i < arr.length; i++) {
      if (unique_array.indexOf(arr[i]) == -1) {
        unique_array.push(arr[i]);
      }
    }
    return unique_array;
  }
  removeDuplicates2(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
}
module.exports = VocabularyFirepoint;
