"use strict";
//Imports
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '../.env.production' }) // for other environments
} else {
    require('dotenv').config({ path: '../.env.development' })
}
const DataModel = require("../models/dataModel.js");
const fs = require('fs');
const databaseApi = require('../api/databaseApi');
const shell = require('shelljs');
const googleSpeechCron = require('../audio_processing/googleConversion');
const path_resolve = require('path').resolve
const momentjs = require('../utils/momentjs');
const Timeout = require('await-timeout');
const conversionUtilEndpoint = require('../endpoints/conversionUtilEndpoint');
const PythonShell = require('python-shell');
const utils = require('../utils/utils')
const IBMCron = require('../audio_processing/ibmApi')

const flagGoogleWorking = false;

//this method is the main method that enter to the algorithm 
//this is maybe not used
async function convertRecord(request, audio_directory) {
    let dataModel = new DataModel(null, null, null);
    console.log("************************************");
    console.log("Request Convert By Pieces in ConversionEndpoint: ");
    console.log(request);
    try {
        //we send it to convert
        let record_folder = audio_directory + "/" + request.uuid;
        let transcription = await this.mainAlgorithm(request.uuid, record_folder);

        //here we might need a datetime to organize
        dataModel.status = 200;
        dataModel.data = transcription;
        dataModel.message = "convert intend";

        return dataModel;
    } catch (error) {
        console.error(error);
        dataModel.status = 400;
        dataModel.data = transcription;
        dataModel.message = "convert intend";
        return dataModel

    }
}
module.exports.convertRecord = convertRecord;

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> MAIN ALGORITHM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
async function mainAlgorithm(record_id, recordFolder) {
    console.log("************************************");
    console.log("Request Main Algorithm Pieces in SpeechEndpoint: ");
    console.log(record_id);
    console.log(recordFolder);
    recordFolder = path_resolve(recordFolder).toString();
    try {
        let transcription = '';

        shell.cd(recordFolder);
        //try the conversion
        console.log("################# PROCESS STARTED ########################")
        //now we have to update the record of the main speech
        let mainRecord = await databaseApi.getRecord(record_id);

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MAIN SPEECH@@@@@@@>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(mainRecord)
        if (mainRecord.exist && mainRecord != null &&
            mainRecord.converted == false &&
            process.env.CONVERT_SILENCES === true) {
            let meeting_id = mainRecord.record.meeting_id;

            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>INITIATE PROCESS MAIN SPEECH CONVERSION>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

            const subrecords = await fs.promises.readdir(recordFolder);
            console.log('SUBRECORDS PIECES')
            console.log(subrecords)

            //here we are saving the individual recorded pieces of the speech object

            let orderCounter = 0;
            let startTime = "00:00:00"
            //here the counter starts too for the order of the records
            for (const subrecord_id of subrecords) {

                if (subrecord_id.indexOf('_piece') > -1) {
                    console.log("*********************DIVIDED SUBRECORD****************************")
                    console.log('SUB RECORD FOLDER NAME:')
                    console.log(subrecord_id)

                    let subrecordFolder = recordFolder + "/" + subrecord_id
                    let subrecordFilePath = subrecordFolder + "/" + subrecord_id + ".wav"
                    let transcriptionPiece = "";

                    await shell.cd(subrecordFolder);

                    let subrecordDuration = await conversionUtilEndpoint
                        .getFileDuration(subrecordFilePath, subrecordFolder);
                    let secondsDuration = momentjs.calculateDuration(subrecordDuration);

                    //This object is the main object that contains all the information to save in the database afterwards
                    let startEndTimeObject = await conversionUtilEndpoint
                        .getSubRecordStartEndTime(subrecord_id, startTime, subrecordDuration);


                    //there must be a validation first to send it to convert, check the duration of the file
                    if (secondsDuration < 60) {
                        console.log('IS LESS THAN ONE MINUTE')

                        ////////////////////////HERE WE NEED TO CHANGE THE API////////////////////////
                        //////////////cmusphinx///////////////
                        console.log('ENTERING CONVERSION SINGLE FILE>>>>>>>>>>>>>>>>>>>>>>>>>>')

                        transcriptionPiece = await this.transcriptionApi(subrecordFilePath);
                        console.log('CURRENT TRANSCRIPTION RESULT LESS THAN 60 SECONDS');
                        console.log(transcriptionPiece)

                        //NOW WE UPDATE THE RECORD IN THE DATABASE 
                        startEndTimeObject.converted = true;
                        startEndTimeObject.transcription = transcriptionPiece;
                        startEndTimeObject.order = orderCounter;
                        startEndTimeObject.record_id = record_id;
                        startEndTimeObject.meeting_id = meeting_id;
                        await databaseApi.saveSubrecord(startEndTimeObject)

                        //we update the loop variables
                        orderCounter++;
                        startTime = startEndTimeObject.newStartTime;

                    } else if (secondsDuration > 60) {
                        console.log('IS MORE THAN ONE MINUTE, CUT PROCESS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

                        await conversionUtilEndpoint
                            .divideFileGreaterThan1Minute(subrecord_id, subrecordFolder);
                        let transcribeSubfoldersObject = await this
                            .transcribeSubfolders(subrecordFolder, orderCounter, startTime, record_id, meeting_id);

                        transcriptionPiece = transcribeSubfoldersObject.totalTranscription;
                        console.log('CURRENT TRANSCRIPTION RESULT MORE THAN 60 SECONDS');
                        console.log(transcriptionPiece)

                        //we update the loop variables
                        orderCounter = transcribeSubfoldersObject.orderCounter;
                        startTime = transcribeSubfoldersObject.newStartTime;

                    } else {
                        console.log('N/A NOT DETERMINED>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

                    }

                    transcription = await conversionUtilEndpoint
                        .addAndClearTranscription(transcription, transcriptionPiece);

                }
            }
            //now we have to update the record of the main speech,
            //here we need a conversion util for discart empty strings
            await databaseApi.updateObjectProperty('Record', record_id, 'transcription', transcription);
            await databaseApi.updateObjectProperty('Record', record_id, 'converted', true);
        } else if (mainRecord.exist && mainRecord != null) {
            ///////////////////////THIS IS WHAT WE ARE USING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
            //here there is conversion without silences
            console.log('ITS NOT USING SILENCES~~~~!!!!!!')
            console.log('WE ARE USING IBM RIGH TNOW~~~~!!!!!!')
            let meeting_id = mainRecord.record.meeting_id;
            console.log('MEETING ID')
            console.log(mainRecord)

            if (!mainRecord.record.converted) {
                let transcriptionRecordPiece = "";
                let pathRecord = recordFolder + "/" + record_id + "_out.wav"
                transcriptionRecordPiece = await this.transcriptionApi(pathRecord, meeting_id);
                console.log('CURRENT TRANSCRIPTION RESULT WITH NO SILENCES');
                console.log(transcriptionRecordPiece)

                if (await utils.isNotEmptyString(transcriptionRecordPiece)) {
                    await databaseApi.updateObjectProperty('Record', record_id, 'transcription', transcriptionRecordPiece);
                    await databaseApi.updateObjectProperty('Record', record_id, 'converted', true);
                } else {
                    await databaseApi.deleteRecord(record_id)
                }

            } else {
                console.log('Record ' + mainRecord.uuid + " is already converted....")
            }
        }
        console.log('FINISHED TRANSCRIPTION PROCESS CONVERTION>>>>>>>>')
        // mainRecord = await databaseApi.getRecord(record_id);
        return mainRecord;

    } catch (err) {
        console.log('ERROR GENERIC>>>>>>')
        console.log(err)
    }
}
module.exports.mainAlgorithm = mainAlgorithm;

//////////////////////////////Transcribe when is more than1 minute
async function transcribeSubfolders(folderPath, orderCounter, startTime, record_id, meeting_id) {
    console.log("************************************");
    console.log("Request transcribeSubfolders in SpeechEndpoint: ");
    try {

        await shell.cd(folderPath);

        const subrecordPieces = await fs.promises.readdir(folderPath);
        console.log('SUBRECORDS PIECES folder')
        console.log(subrecordPieces)

        let totalTranscription = "";
        for (const subrecordpiece_name of subrecordPieces) {

            console.log("*********************DIVIDED SUBRECORD PIECE****************************")

            if (subrecordpiece_name.indexOf('_subpiece') > -1) {
                let subrecordpiece_id = subrecordpiece_name.replace(".wav", "");
                let filePath = folderPath + "/" + subrecordpiece_name;

                let currentSubrecordPieceTranscription = await this.transcriptionApi(filePath, meeting_id);
                console.log('CURRENT TRANSCRIPTION RESULT');
                console.log(currentSubrecordPieceTranscription)

                totalTranscription = await conversionUtilEndpoint
                    .addAndClearTranscription(totalTranscription, currentSubrecordPieceTranscription);

                //now here we make the evaluation of the recording file and save in database
                let subrecordpieceDuration = await conversionUtilEndpoint
                    .getFileDuration(filePath, folderPath);

                //This object is the main object that contains all the information to save in the database afterwards
                let startEndTimeSubrecordPieceObject = await conversionUtilEndpoint
                    .getSubRecordStartEndTime(subrecordpiece_id, startTime, subrecordpieceDuration);

                //NOW WE UPDATE THE RECORD IN THE DATABASE 
                startEndTimeSubrecordPieceObject.converted = true;
                startEndTimeSubrecordPieceObject.transcription = currentSubrecordPieceTranscription;
                startEndTimeSubrecordPieceObject.order = orderCounter;
                startEndTimeSubrecordPieceObject.record_id = record_id;
                startEndTimeSubrecordPieceObject.meeting_id = meeting_id;

                await databaseApi.saveSubrecord(startEndTimeSubrecordPieceObject)

                startTime = startEndTimeSubrecordPieceObject.newStartTime;
                orderCounter++;
            }
        }

        let resultObject = {
            newStartTime: startTime,
            orderCounter: orderCounter,
            totalTranscription: totalTranscription
        }

        return resultObject;
    } catch (error) {
        console.error(error);
    }
}
module.exports.transcribeSubfolders = transcribeSubfolders;

//////////////////////////HERE THERE ARE ALL THE TRANSCRIPTION OPTIONS
async function transcriptionApi(subrecordFilePath, meeting_id) {
    return await IBMCron.convertIBM(subrecordFilePath, meeting_id)
}
module.exports.transcriptionApi = transcriptionApi;

async function transcribeGoogleApi(audioPath) {
    return await googleSpeechCron(audioPath)
}
module.exports.transcribeGoogleApi = transcribeGoogleApi;

async function transcribeCmusSphinx(audioPath) {
    let cmusSphinxResult = "";
    let pythonScriptPath = path_resolve(__dirname + "/../cron_jobs/cmusphinx.py").toString();

    let resultExec = await shell.exec('sudo python3 ' + pythonScriptPath + " " + audioPath)
    if (resultExec && resultExec != "" && !resultExec.includes('ERROR')) {
        cmusSphinxResult = resultExec.stdout.toString();
    } else {
        console.log('THERE WAS A PROBLEM IN CONVERSION')
        cmusSphinxResult = 'THERE WAS A PROBLEM IN CONVERSION';
    }
    return cmusSphinxResult;
}
module.exports.transcribeCmusSphinx = transcribeCmusSphinx;