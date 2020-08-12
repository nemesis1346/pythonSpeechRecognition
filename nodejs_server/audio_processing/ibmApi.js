"use strict";
//Imports
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    require('dotenv').config({ path: '../.env.development' })
}
const fs = require('fs');
const shell = require('shelljs');

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const accesspoints = require("../constants/ibm_accesspoints")
const databaseApi = require('../api/databaseApi');
const { selectLanguage } = require('../endpoints/recordsEndpoint');

const speechToTextForNodeJs = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_KEY,
    }),
    url: process.env.IBM_URL_NODEJS, //THIS IS THE DEFAULT IN TOKIO
});

async function convertIBM(filePath, meetingId) {
    console.log('IBM CONVERSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    let finalString = "";

    try {

        let accesspointByHostname = "";
        const { stdout, stderr, code } = await shell.exec('hostname')
        let shellHostname = stdout;

        //this is not working yet 
        if (shellHostname.indexOf("us") !== -1) {
            console.log('HOSTNAME IS NEAR WASHINGTON')
            accesspointByHostname = accesspoints.WASHINGTON;
        } else if (shellHostname.indexOf("uk") !== -1) {
            console.log('HOSTNAME IS NEAR UK')
            accesspointByHostname = accesspoints.LONDON;
        } else if (shellHostname.indexOf("de") !== -1) {
            console.log('HOSTNAME IS NEAR GERMANY')
            accesspointByHostname = accesspoints.FRANKFURT;
        } else if (shellHostname.indexOf("cn") !== -1) {
            console.log('HOSTNAME IS NEAR CHINA')
            accesspointByHostname = accesspoints.TOKYO;
        } else if (shellHostname.indexOf("sg") !== -1) {
            console.log('HOSTNAME IS NEAR SINGAPORE')
            accesspointByHostname = accesspoints.TOKYO;
        } else if (shellHostname.indexOf("au") !== -1) {
            console.log('HOSTNAME IS NEAR AUSTRALIA')
            accesspointByHostname = accesspoints.SYDNEY;
        } else if (shellHostname.indexOf("my") !== -1) {
            console.log('HOSTNAME IS NEAR MALASYA')
            accesspointByHostname = accesspoints.TOKYO;
        } else if (shellHostname.indexOf("pl") !== -1) {
            console.log('HOSTNAME IS NEAR POLAND')
            accesspointByHostname = accesspoints.FRANKFURT;
        } else if (shellHostname.indexOf("in") !== -1) {
            console.log('HOSTNAME IS NEAR INDIA')
            accesspointByHostname = accesspoints.TOKYO;
        } else if (shellHostname.indexOf("ca") !== -1) {
            console.log('HOSTNAME IS NEAR CANADA')
            accesspointByHostname = accesspoints.WASHINGTON;
        } else if (shellHostname.indexOf("ae") !== -1) {
            console.log('HOSTNAME IS NEAR DUBAI')
            accesspointByHostname = accesspoints.FRANKFURT;
        }

        //we get the selected language
        let roomstate = await databaseApi.getLanguageSelectedByMeetingId(meetingId)
        let selected_language = "en-US_BroadbandModel"
        if (roomstate != null&&roomstate.language_selected!=null) {
            selected_language = roomstate.language_selected;
        }
        console.log('LANGUAGE SELECTED!!!>>>>>>>>>>>>>>>>>>')
        console.log(selected_language)
        if (fs.existsSync(filePath)) {
            const recognizeParams = {
                audio: fs.createReadStream(filePath),
                contentType: 'audio/wav',
                model: selected_language
                //   wordAlternativesThreshold: 0.9,
                //   keywords: ['colorado', 'tornado', 'tornadoes'],
                //   keywordsThreshold: 0.5,
            };
            console.log('FINAL HOSTNAME URL')
            console.log(accesspointByHostname)


            speechToTextForNodeJs.resetLanguageModel()
            let result = await speechToTextForNodeJs.recognize(recognizeParams)
            console.log(result.result.results)
            let results = result.result.results
            if (results.length > 0) {
                for (const alternative of results) {
                    finalString = finalString + alternative.alternatives[0].transcript;
                }

            } else {
                finalString = "";
            }
        } else {
            finalString = "File was lost";

        }



    } catch (error) {
        console.error(error);
        finalString = error.message
    }
    return finalString;

}
module.exports.convertIBM = convertIBM;

async function convertIBMWithCURL(filePath) {
    let ibmApiKey = process.env.IBM_KEY;
    let ibmUrlApi = process.env.IBM_URL
    let finalString = "";

    try {
        let ibmResult = await shell.exec('curl -X POST -u "apikey:' + ibmApiKey + '" --header "Content-Type: audio/wav" --data-binary @' + filePath + ' ' + ibmUrlApi)
        console.log('curl -X POST -u "apikey:' + ibmApiKey + '" --header "Content-Type: audio/wav" --data-binary @' + filePath + ' ' + ibmUrlApi)
        if (JSON.parse(ibmResult).results && JSON.parse(ibmResult).results != null && JSON.parse(ibmResult).results.length > 0) {
            console.log('THERE WAS A RESULT!!!!!!!!!!!!!!!1>>>>>>>>>>>>>>>>>>>>>>>>')
            console.log(JSON.parse(ibmResult))
            let parsedResults = JSON.parse(ibmResult).results;
            console.log('PARSED RESULTS')
            console.log(parsedResults)
            //we have to add up all the possibilities
            for (const alternative of parsedResults) {
                finalString = finalString + alternative.alternatives[0].transcript;
            }

        } else {
            finalString = "";
        }
    } catch (error) {
        console.error(error);
        finalString = error.message
    }
    return finalString;

}
module.exports.convertIBMWithCURL = convertIBMWithCURL;

async function getIBMLaguagesOptions(filePath) {
    let languageList = []
    try {
        languageList = await speechToTextForNodeJs.listModels()
        languageList = JSON.stringify(languageList.result.models)
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.')
        console.log(languageList)
    } catch (error) {
        console.error(error);
        finalString = error.message
    }
    return languageList;

}
module.exports.getIBMLaguagesOptions = getIBMLaguagesOptions;