const sequelizedb = require('../api/connection');
const Sequelize = require('sequelize');
const ConversionUtilEndpoint = require('../endpoints/conversionUtilEndpoint.js');
const ConvertAllRecordsEndpoint = require('../endpoints/convertAllRecordsEndpoint');
const ConvertRecordEndpoint = require('../endpoints/convertRecordEndpoint');
const RecordsEndpoint = require('../endpoints/recordsEndpoint.js');
const SubrecordsEndpoint = require('../endpoints/subRecordsEndpoint.js');
const SessionEndpoint = require('../endpoints/sessionEndpoint');
const DataModel = require("../models/dataModel");
const path_resolve = require('path').resolve
const ENDPOINTS = require('../constants/server_endpoints');


const conversionUtilEndpoint = new ConversionUtilEndpoint();
const convertAllRecordsEndpoint = new ConvertAllRecordsEndpoint()
const convertRecordEndpoint = new ConvertRecordEndpoint()
const recordsEndpoint = new RecordsEndpoint()
const subrecordsEndpoint = new SubrecordsEndpoint()
const sessionEndpoint = new SessionEndpoint()

async function stop() {
    console.log('Shutting down...')
    if (process.env.DEBUG) console.log(process._getActiveHandles())
    process.exit(0)
}
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM')
    await stop()
})

process.on('SIGINT', async () => {
    console.log('Received SIGINT')
    await stop()
})
process.on('message', async function (input) {
    console.log('LISTENING MESSAGE');
    console.log(input);
    let result;
    let dataModel = new DataModel(null, null, null);

    try {
        let bufferContent = JSON.parse(input.data);
        let url = input.url;
        switch (url) {
            case ENDPOINTS.GET_RECORDS:
                result = await recordsEndpoint.getRecords(
                    JSON.parse(bufferContent)
                );
                break;
            case ENDPOINTS.CONVERT_RECORD:
                result = await convertRecordEndpoint.convertRecord(
                    JSON.parse(bufferContent),
                    FOLDER_DIRECTORIES.AUDIO_FOLDER
                );
                break;
            case ENDPOINTS.STREAM_RECORD:
                result = await recordsEndpoint.streamRecord(
                    JSON.parse(bufferContent)
                );
                break;
            case ENDPOINTS.GET_RECORD:
                result = await recordsEndpoint.getRecord(
                    JSON.parse(bufferContent)
                );
                break;
            case ENDPOINTS.UPDATE_TRANSCRIPT:
                result = await recordsEndpoint.updateTranscript(
                    JSON.parse(bufferContent)
                );
                break;
            case ENDPOINTS.CONVERT_ALL_RECORDS:
                result = await convertAllRecordsEndpoint.convertAllRecords(
                    FOLDER_DIRECTORIES.AUDIO_FOLDER
                );
                break;
            case ENDPOINTS.CREATE_VTT_FILE_BY_RECORD_ID:
                result = await conversionUtilEndpoint.createVttFileByRecordId(
                    JSON.parse(bufferContent),
                    FOLDER_DIRECTORIES.TEXT_FOLDER
                );
                break;
            case ENDPOINTS.CREATE_VTT_FILE_BY_MEETING_ID:
                result = await conversionUtilEndpoint.createVttFileByMeetingId(
                    JSON.parse(bufferContent),
                    FOLDER_DIRECTORIES.TEXT_FOLDER
                );
                break;
            case ENDPOINTS.GET_LAST_RECORD:
                result = await recordsEndpoint.getLastRecord(JSON.parse(bufferContent));
                break;
            case ENDPOINTS.GET_SUB_RECORDINGS_BY_ID:
                result = await subrecordsEndpoint.getSubRecordsById(JSON.parse(bufferContent));
                break;
            case ENDPOINTS.GET_TRANSCRIPTLIST_BY_MEETINGID:
                result = await recordsEndpoint.getTranscriptListByMeetingId(JSON.parse(bufferContent));
                break;
            case ENDPOINTS.VERIFY_SERVER:
                result = await sessionEndpoint.verifyServer(JSON.parse(bufferContent));
                break;
            default:
                dataModel.message = "Method not found";
                dataModel.status = "405";
                let body = JSON.stringify(dataModel);

                console.log("STATUS 405: ");
                console.log("Method not found");
                const responseBody = { headers, method, url, body };

                response.statusCode = 405;
                response.write(JSON.stringify(responseBody));
                response.end();
                break;
        }

        //Executing the result , maybe need POST and GET
        if (result != null) {
            //console.log(result);
            //This is status 200 , everything ok
            if (result) {
                if (result.status == "200") {
                    dataModel.data = result;
                    dataModel.status = "200";
                } else {
                    // console.log(dataModel);
                    dataModel.message = result;
                    dataModel.status = "300";
                }
            } else {
                console.log("Something went wrong");
                console.log(result);
            }
            let body = JSON.stringify(dataModel);
            console.log("STATUS 200: ");
            console.log(body);
            process.send(body);
        }
        //STILL NOT WORKING 
        //process.exit(0)

    } catch (error) {
        console.log("ERROR IN HANDLER PROCESS");
        dataModel.message = error.message.toString();
        dataModel.status = "400";
        let body = JSON.stringify(dataModel);
        console.log("ERROR 400:");
        console.log(dataModel);
        process.send(body);
    }
});