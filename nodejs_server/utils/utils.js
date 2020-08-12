
"use strict";
const shell = require('shelljs');
const moment = require('moment');

module.exports = {


    createFolder: async function (folderName, FolderPath) {
        await shell.cd(FolderPath);
        await shell.exec('pwd')
        await shell.exec('sudo mkdir ' + folderName)
        await shell.exec('sudo chmod -R 777 ' + folderName)
        await shell.exec('sudo mount -o remount,rw -rf ' + folderName)
    },


    hhmmss: async function (secs) {
        return await moment("2015-01-01").startOf('day')
        .seconds(secs)
        .format('H:mm:ss');
    },

    removeDuplicatesProp: function (arr, prop) {
        let obj = {};
        return Object.keys(
            arr.reduce((prev, next) => {
                if (!obj[next[prop]]) obj[next[prop]] = next;
                return obj;
            }, obj)
        ).map(i => obj[i]);
    },

    isNotEmptyString: function (inputString) {
        if (inputString.replace(/\s/g, '').length) {
            return true
        } else {
            return false
        }
    },

    parseContent: function (content) {
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
    },

    removeDuplicates: function (arr) {
        let unique_array = [];
        for (let i = 0; i < arr.length; i++) {
            if (unique_array.indexOf(arr[i]) == -1) {
                unique_array.push(arr[i]);
            }
        }
        return unique_array;
    },
    removeDuplicates2: function (myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
}

