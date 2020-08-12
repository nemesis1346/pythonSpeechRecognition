// require("regenerator-runtime/runtime");

require('../api/connection');
const connection = require('./unitTestingEndpoints.js');
const DataModel = require("../models/dataModel");
const path_resolve = require('path').resolve
const ConverstionUtilEndpoint = require('../endpoints/conversionUtilEndpoint');
const ConvertRecordEndpoint = require('../endpoints/convertRecordEndpoint');
const ConvertAllRecordsEndpoint = require('../endpoints/convertAllRecordsEndpoint');
const UploadFilesEndpoint = require('../endpoints/uploadFilesEndpoint');
const DatabaseInstance = require('../api/databaseApi');
const audioAbsolutePath = path_resolve(__dirname + '/../../audio_files').toString() + '/';
const shell = require('shelljs');
const utils = require("../utils/utils");
const { uploadFilesEndpoint } = require('../middleware/server');
const PythonShell = require('python-shell');
const { spawn } = require('child_process');


const root = __dirname + "/../"

const wavTestDirectory = __dirname + "/wavTestFolder/final2"
// const wavTestDirectory =  "/bigdisk/speech/audio_files"
const textfiles_folder = __dirname + "/wavTestFolder/final2"
let uuid_audio_file = "final2";
// let uuid_audio_file = "nhBCMadGnkb23n7JQRuBDJ";

async function saveSubRecordsInDatabase() {
    try {
        let conversionUtilEndpoint = new ConverstionUtilEndpoint();

        let result = await conversionUtilEndpoint.saveSubRecordInDatabase(uuid_audio_file, wavTestDirectory);
        console.log(result)

    } catch (error) {
        console.log(error)
    }
}

//this method resides within /uploadFilesEndpoint/normalizeFileAndDivide
async function normalizeFileAndDivide() {

    try {
        let uploadFilesEndpoint = new UploadFilesEndpoint();
        let uuid = uuid_audio_file;

        let filenameWav = uuid + ".wav";

        let folderPath = wavTestDirectory;
        let filepathWav = folderPath + "/" + filenameWav;
        let result = await uploadFilesEndpoint.normalizeRecordAndDivide(uuid, filepathWav, wavTestDirectory);
        console.log(result)

    } catch (error) {
        console.log(error)
    }
}

async function deleteSubRecordFiles() {
    try {
        let conversionUtilEndpoint = new ConverstionUtilEndpoint();
        let uuid = uuid_audio_file;

        let folderPath = wavTestDirectory;
        await conversionUtilEndpoint.deleteSubRecordFiles(folderPath);

    } catch (error) {
        console.log(error)
    }
}
async function deleteAllSubRecordsInDatabase() {
    try {
        let conversionUtilEndpoint = new ConverstionUtilEndpoint();
        let uuid = uuid_audio_file;

        let folderPath = wavTestDirectory;
        await conversionUtilEndpoint.deleteAllSubRecordsInDatabase(folderPath);

    } catch (error) {
        console.log(error)
    }
}
async function getFileDuration() {
    try {
        let conversionUtilEndpoint = new ConverstionUtilEndpoint();
        let uuid = uuid_audio_file;

        let folderPath = wavTestDirectory;
        await conversionUtilEndpoint.getFileDuration(uuid, folderPath);

    } catch (error) {
        console.log(error)
    }
}

async function createVttFile() {
    try {
        let conversionUtilEndpoint = new ConverstionUtilEndpoint();
        let uuid = uuid_audio_file;

        await conversionUtilEndpoint.createVttFile(uuid, textfiles_folder);

    } catch (error) {
        console.log(error)
    }
}
async function convertRecord() {
    try {
        let convertRecordEndpoint = new ConvertRecordEndpoint();
        let uuid = uuid_audio_file;

        let folderPath = __dirname + "/wavTestFolder";
        let userObject = {
            uuid: uuid,
        }
        await convertRecordEndpoint.convertRecord(userObject, folderPath);

    } catch (error) {
        console.log(error)
    }
}
async function saveMainWavFile() {
    try {
        let databaseApi = new DatabaseInstance();
        let uuid = uuid_audio_file;

        let speechRecord = {
            uuid: uuid,
            userId: 1, //this is testing,
            converted: false,
            transcription: ""
        };
        await databaseApi.saveRecord(speechRecord);

    } catch (error) {
        console.log(error)
    }
}

async function saveMainWavFile() {
    try {
        let databaseApi = new DatabaseInstance();
        let uuid = uuid_audio_file;

        let speechRecord = {
            uuid: uuid,
            userId: 1, //this is testing,
            converted: false,
            transcription: ""
        };
        await databaseApi.saveRecord(speechRecord);

    } catch (error) {
        console.log(error)
    }
}

async function createSubfolder() {
    try {
        let uploadFilesEndpoint = new UploadFilesEndpoint();
        let folderPath = wavTestDirectory;

        let uuid = uuid_audio_file;
        await uploadFilesEndpoint.createSubfolder(folderPath);
    } catch (error) {
        console.log(error)
    }
}

async function createFolder() {
    try {
        let folderPath = wavTestDirectory;

        let uuid = uuid_audio_file;
        await uploadFilesEndpoint.createFolder(uuid, folderPath);
    } catch (error) {
        console.log(error)
    }
}

async function transcribeCmusSphinx() {

    let pythonScriptPath = path_resolve(__dirname + "/../cron_jobs/cmusphinx.py").toString();

    let audioPath = '/home/apps/speech/nodejs_server/testing/wavTestFolder/final2/final2_piece032/final2_piece032.wav';
    let resultExec = await shell.exec('sudo python3 ' + pythonScriptPath + " " + audioPath + " final2_piece040")
    if (resultExec && resultExec != "" && !resultExec.includes('ERROR')) {
        console.log('FINAL RESULT')
        console.log(resultExec.stdout.toString())
    } else {
        console.log('THERE WAS A PROBLEM IN CONVERSION')
        console.log(resultExec)
    }

}

async function timeoutGoogle() {
    try {
        let convertRecordEndpoint = new ConvertRecordEndpoint();
        let uuid = uuid_audio_file;

        let audioPath = '/home/apps/speech/nodejs_server/testing/wavTestFolder/final2/final2_piece032/final2_piece032.wav';

        await convertRecordEndpoint.transcriptionApi(audioPath);

    } catch (error) {
        console.log(error)
    }

}
async function curlIBM() {

    // let ibmResult = await shell.exec('curl -X POST -u "apikey:qCI_uusSTXyqAuw73qVhV1DDoMJgJBCgIdIux3S9ldJx" --header "Content-Type: audio/wav" --data-binary @final2_piece001.wav https://api.jp-tok.speech-to-text.watson.cloud.ibm.com/instances/f8cab30e-1f1a-4a2b-8f87-5482d079a97d/v1/recognize')
    let ibmApiKey = process.env.IBM_KEY;
    let ibmUrlApi = process.env.IBM_URL;
    console.log(ibmApiKey)
    console.log(ibmUrlApi)
    let filePath = '/home/apps/speech/nodejs_server/testing/wavTestFolder/final2/final2_piece001/final2_piece001.wav'
    let ibmResult =
        await shell.exec('curl -X POST -u "apikey:' + ibmApiKey + '" --header "Content-Type: audio/wav" --data-binary @' + filePath + ' ' + ibmUrlApi)
    let parsedResult = JSON.parse(ibmResult).results[0].alternatives;
    console.log(parsedResult);
}
async function runtime() {
    //we first clean up the database;
    await shell.cd(root)
    await shell.exec("pwd");
    //need to drop the records of a table
    await shell.exec('sudo npx sequelize-cli db:drop --env=production')
    await shell.exec('sudo npx sequelize-cli db:create --env=production')
    await shell.exec('sudo npx sequelize-cli db:migrate --env=production')

    await saveMainWavFile();
    await normalizeFileAndDivide();
    await createSubfolder();

    await convertRecord();
    // await createVttFile();

    // await transcribeCmusSphinx();

    // await timeoutGoogle();

    //until here the process is implemented
    // await deleteAllSubRecordsInDatabase();
    // await deleteSubRecordFiles();

    // //here starts the conversion

    await curlIBM()

}

runtime(); 