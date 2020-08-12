"use strict";
const DataModel = require("../models/dataModel.js");
const databaseApi = require('../api/databaseApi');
const shell = require('shelljs');
const IBMCron = require('../audio_processing/ibmApi')


async function getRecords(meetingId) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Get Records in RecordsEndpoint: ");
    console.log(meetingId);
    try {
        let finalList = await databaseApi.getAllRecords();
        console.log('RECORDS IN RECORDS ENDPOINT')
        console.log(finalList)
        dataModel.status = 200;
        dataModel.data = finalList;
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecords = getRecords;

async function getLanguagelist(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("getLanguagelist in Conversion Util Endpoint: ");
    let languageList = []
    let language_selected = "";
    try {
        languageList = await IBMCron.getIBMLaguagesOptions()
        //this is the defautl language
        let roomstate = await databaseApi.getRoomState(request.meetingId)
        console.log('ROOM STATE!!!!!!')
        console.log(roomstate)
        if (roomstate != null) {
            console.log('IS NOT NULL')
            console.log(roomstate.language_selected)
            language_selected = roomstate.language_selected;
        }
        // await databaseApi.updateObjectProperty('Roomstate', request.meetingId, 'language_selected', "en-US_BroadbandModel");

    } catch (error) {
        console.error(error);
    }
    dataModel.status = 200;
    dataModel.data = JSON.stringify({ languageList: languageList, language_selected: language_selected });
    return dataModel;
}
module.exports.getLanguagelist = getLanguagelist;


async function selectLanguage(request) {
    let dataModel = new DataModel(null, null, null);

    console.log("************************************");
    console.log("selectLanguage in Conversion Util Endpoint: ");
    console.log(request)

    try {
        await databaseApi.updateObjectProperty('Roomstate', request.meetingId, 'language_selected', request.language_selected);

    } catch (error) {
        console.error(error);
    }
    dataModel.status = 200;
    dataModel.data = JSON.stringify('Language Selected');
    return dataModel;

}
module.exports.selectLanguage = selectLanguage;


async function getRecordsByMeetingId(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Get Records in RecordsEndpoint: ");
    console.log(request);
    try {
        let finalList = await databaseApi.getRecordsByMeetingId(request.meetingId);
        console.log('RECORDS IN RECORDS ENDPOINT')
        console.log(finalList)
        dataModel.status = 200;
        dataModel.data = finalList;
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecordsByMeetingId = getRecordsByMeetingId;

async function updateTranscript(object) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Update Transcript in RecordsEndpoint: ");
    console.log(object);
    try {
        let objectTranscription = object.object
        let updatedObject = await databaseApi.updateObjectProperty(
            'Record',
            objectTranscription.uuid,
            'transcription',
            objectTranscription.transcription);

        dataModel.status = 200;
        dataModel.data = JSON.stringify(updatedObject);
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.updateTranscript = updateTranscript;

async function getRecord(input) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Get Record in RecordEndpoint: ");
    console.log(input);
    try {
        let query = await databaseApi.getRecord(input.uuid);
        let record;
        if (query.exist && query != null) {
            record = query.record

            dataModel.status = 200;
            dataModel.data = JSON.stringify(record);
        } else {
            dataModel.status = 300;
            dataModel.message = "Record Not found";
        }

        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecord = getRecord;

async function getLastRecord(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Get Last Speech in RecordEndpoint: ");
    console.log(request)
    try {
        let record = await databaseApi.getLastRecord(request.meetingId);

        dataModel.status = 200;
        dataModel.data = JSON.stringify(record);
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getLastRecord = getLastRecord;


async function deleteRecord(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Delete Record in RecordEndpoint: ");
    console.log(request)
    try {
        await databaseApi.deleteRecord(request.uuid);

        dataModel.status = 200;
        dataModel.data = JSON.stringify('Record ' + request.uuid + " deleted");
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.deleteRecord = deleteRecord;

async function getTranscriptListByMeetingId(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request getTranscriptListByMeetingId in RecordEndpoint: ");
    console.log(request)
    try {
        let finalList = [];
        if (request.pullDate) {
            finalList = await databaseApi.getRecordListByMeetingId(request.meetingId, request.pullDate);

        } else {
            finalList = await databaseApi.getRecordListByMeetingId(request.meetingId, null);

        }
        let roomstate = await databaseApi.getRecordingFlag(request.meetingId)
        let recordingFlag = false
        let language_selected
        if (roomstate && roomstate != null) {
            recordingFlag = roomstate.isRecording;
        }
        //for selected language
        if (roomstate && roomstate != null && roomstate.language_selected != null) {
            language_selected = roomstate.language_selected
        } else {
            language_selected = "en-US_BroadbandModel"
        }

        let isShellRunningResponse = await shell.exec('sudo bash /home/apps/speech/check-cronjob.sh')
        let cronJobResult = JSON.parse(isShellRunningResponse);

        let isCronRunning = false
        if (cronJobResult) {
            isCronRunning = true
        } else {
            recordingFlag = false;
            isCronRunning = false
        }

        dataModel.status = 200;
        dataModel.data = JSON.stringify({
            transcriptionList: finalList,
            isRecording: recordingFlag,
            isCronRunning: isCronRunning,
            language_selected: language_selected
        });
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getTranscriptListByMeetingId = getTranscriptListByMeetingId;

async function streamRecord(request) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Stream Record in RecordEndpoint: ");
    console.log(request)
    try {
        let record = await databaseApi.getLastRecord(request.meetingId);

        dataModel.status = 200;
        dataModel.data = JSON.stringify(record);
        return dataModel;
    } catch (error) {
        console.error(error);
    }
}
module.exports.streamRecord = streamRecord;